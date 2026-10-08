/**
 * VÉLANE ATELIER - Central Reactive State Store
 */

import { PRODUCTS, PROMO_CODES } from '../data/products.js';
import { loadFromStorage, saveToStorage, generateId } from '../utils/helpers.js';

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING_FEE = 149;
const TAX_RATE = 0.05; // 5% GST mock tax

class Store {
  constructor() {
    this.subscribers = new Set();

    // Initialize Cart from storage (syncing with current catalog prices)
    const storedCart = loadFromStorage('cart', []);
    this.cart = storedCart.map(item => {
      const p = PRODUCTS.find(prod => prod.id === item.productId);
      if (p) item.price = p.price;
      return item;
    });
    this.wishlist = loadFromStorage('wishlist', []);
    this.appliedPromo = loadFromStorage('promo', null);

    // Filter & Search State
    this.filters = {
      category: 'all',
      gender: 'all',
      size: null,
      color: null,
      maxPrice: 15000,
      searchQuery: '',
      sort: 'featured', // 'featured', 'price-low', 'price-high', 'rating', 'newest'
      inStockOnly: false
    };

    // UI state
    this.ui = {
      isCartOpen: false,
      isWishlistOpen: false,
      isCheckoutOpen: false,
      isMobileMenuOpen: false,
      quickViewProductId: null,
      sizeGuideGender: null,
      orderSuccessData: null
    };
  }

  subscribe(listener) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  notify(eventType, payload) {
    this.subscribers.forEach(listener => {
      try {
        listener(eventType, payload, this);
      } catch (err) {
        console.error('Error in store subscriber:', err);
      }
    });
  }

  // --- Cart Operations ---

  addToCart(productId, selectedColorName, selectedSize, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return false;

    // Check inventory stock
    const variantKey = `${selectedColorName}-${selectedSize}`;
    const maxStock = product.inventory[variantKey] ?? 10;
    
    if (maxStock <= 0) {
      this.notify('toast', { type: 'error', message: 'Selected variant is currently out of stock.' });
      return false;
    }

    const colorObj = product.colors.find(c => c.name === selectedColorName) || product.colors[0];
    const image = colorObj?.images[0] || '';

    // Check if matching line item already exists
    const existingIndex = this.cart.findIndex(
      item => item.productId === productId && item.selectedColor === selectedColorName && item.selectedSize === selectedSize
    );

    if (existingIndex > -1) {
      const newQty = this.cart[existingIndex].quantity + quantity;
      if (newQty > maxStock) {
        this.cart[existingIndex].quantity = maxStock;
        this.notify('toast', { type: 'warning', message: `Stock limit reached (${maxStock} items available).` });
      } else {
        this.cart[existingIndex].quantity = newQty;
      }
    } else {
      const initialQty = Math.min(quantity, maxStock);
      this.cart.push({
        id: generateId('item'),
        productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        selectedColor: selectedColorName,
        selectedColorHex: colorObj.hex,
        selectedSize,
        image,
        quantity: initialQty,
        maxStock
      });
    }

    this.persistCart();
    this.notify('cart_updated', { cart: this.cart });
    this.notify('toast', { 
      type: 'success', 
      message: `Added "${product.name}" (${selectedSize} / ${selectedColorName}) to your bag.` 
    });
    return true;
  }

  updateCartQuantity(itemId, quantity) {
    const item = this.cart.find(i => i.id === itemId);
    if (!item) return;

    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }

    if (item.maxStock && quantity > item.maxStock) {
      item.quantity = item.maxStock;
      this.notify('toast', { type: 'warning', message: `Only ${item.maxStock} items available in stock.` });
    } else {
      item.quantity = quantity;
    }

    this.persistCart();
    this.notify('cart_updated', { cart: this.cart });
  }

  removeFromCart(itemId) {
    const item = this.cart.find(i => i.id === itemId);
    this.cart = this.cart.filter(i => i.id !== itemId);
    this.persistCart();
    this.notify('cart_updated', { cart: this.cart });
    if (item) {
      this.notify('toast', { type: 'info', message: `Removed "${item.name}" from your bag.` });
    }
  }

  clearCart() {
    this.cart = [];
    this.appliedPromo = null;
    this.persistCart();
    saveToStorage('promo', null);
    this.notify('cart_updated', { cart: this.cart });
  }

  persistCart() {
    saveToStorage('cart', this.cart);
  }

  getCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);

    let discount = 0;
    let isFreeShippingByPromo = false;

    if (this.appliedPromo) {
      if (this.appliedPromo.discountPercent) {
        discount = subtotal * (this.appliedPromo.discountPercent / 100);
      }
      if (this.appliedPromo.freeShipping) {
        isFreeShippingByPromo = true;
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || isFreeShippingByPromo;
    const shipping = subtotal === 0 ? 0 : (qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_FEE);
    const tax = discountedSubtotal * TAX_RATE;
    const total = discountedSubtotal + shipping + tax;
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

    return {
      subtotal,
      itemCount,
      discount,
      shipping,
      tax,
      total,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountToFreeShipping,
      freeShippingProgress,
      qualifiesForFreeShipping
    };
  }

  applyPromoCode(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      this.notify('toast', { type: 'error', message: 'Please enter a valid promotional code.' });
      return false;
    }

    const promo = PROMO_CODES[cleanCode];
    if (promo) {
      this.appliedPromo = { code: cleanCode, ...promo };
      saveToStorage('promo', this.appliedPromo);
      this.notify('cart_updated', { cart: this.cart });
      this.notify('toast', { 
        type: 'success', 
        message: `Promo code "${cleanCode}" applied: ${promo.description}!` 
      });
      return true;
    } else {
      this.notify('toast', { type: 'error', message: `Invalid code "${cleanCode}". Try WELCOME15 or STYLE20.` });
      return false;
    }
  }

  removePromoCode() {
    this.appliedPromo = null;
    saveToStorage('promo', null);
    this.notify('cart_updated', { cart: this.cart });
    this.notify('toast', { type: 'info', message: 'Promotional code removed.' });
  }

  // --- Wishlist Operations ---

  toggleWishlist(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const exists = this.wishlist.includes(productId);
    if (exists) {
      this.wishlist = this.wishlist.filter(id => id !== productId);
      this.notify('toast', { type: 'info', message: `Removed "${product.name}" from your wishlist.` });
    } else {
      this.wishlist.push(productId);
      this.notify('toast', { type: 'success', message: `Saved "${product.name}" to your wishlist.` });
    }

    saveToStorage('wishlist', this.wishlist);
    this.notify('wishlist_updated', { wishlist: this.wishlist });
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  // --- Filters & Search ---

  setFilter(filterKey, value) {
    this.filters[filterKey] = value;
    this.notify('filters_changed', { filters: this.filters });
  }

  resetFilters() {
    this.filters = {
      category: 'all',
      gender: 'all',
      size: null,
      color: null,
      maxPrice: 15000,
      searchQuery: '',
      sort: 'featured',
      inStockOnly: false
    };
    this.notify('filters_changed', { filters: this.filters });
  }

  getFilteredProducts() {
    return PRODUCTS.filter(product => {
      // Category filter
      if (this.filters.category !== 'all' && product.category !== this.filters.category) {
        return false;
      }

      // Gender filter
      if (this.filters.gender !== 'all' && product.gender !== 'unisex' && product.gender !== this.filters.gender) {
        return false;
      }

      // Size filter
      if (this.filters.size && !product.sizes.includes(this.filters.size)) {
        return false;
      }

      // Max Price filter
      if (product.price > this.filters.maxPrice) {
        return false;
      }

      // Search query filter
      if (this.filters.searchQuery.trim()) {
        const q = this.filters.searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      // In stock only filter
      if (this.filters.inStockOnly) {
        const totalStock = Object.values(product.inventory).reduce((a, b) => a + b, 0);
        if (totalStock <= 0) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (this.filters.sort) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }

  // --- UI Toggles ---

  openCart() {
    this.ui.isCartOpen = true;
    this.notify('ui_changed', this.ui);
  }

  closeCart() {
    this.ui.isCartOpen = false;
    this.notify('ui_changed', this.ui);
  }

  openWishlist() {
    this.ui.isWishlistOpen = true;
    this.notify('ui_changed', this.ui);
  }

  closeWishlist() {
    this.ui.isWishlistOpen = false;
    this.notify('ui_changed', this.ui);
  }

  openQuickView(productId) {
    this.ui.quickViewProductId = productId;
    this.notify('ui_changed', this.ui);
  }

  closeQuickView() {
    this.ui.quickViewProductId = null;
    this.notify('ui_changed', this.ui);
  }

  openSizeGuide(gender = 'women') {
    this.ui.sizeGuideGender = gender;
    this.notify('ui_changed', this.ui);
  }

  closeSizeGuide() {
    this.ui.sizeGuideGender = null;
    this.notify('ui_changed', this.ui);
  }

  openCheckout() {
    if (this.cart.length === 0) {
      this.notify('toast', { type: 'warning', message: 'Your bag is empty! Add items first.' });
      return;
    }
    this.ui.isCartOpen = false;
    this.ui.isCheckoutOpen = true;
    this.notify('ui_changed', this.ui);
  }

  closeCheckout() {
    this.ui.isCheckoutOpen = false;
    this.notify('ui_changed', this.ui);
  }

  setOrderSuccess(orderData) {
    this.ui.orderSuccessData = orderData;
    this.clearCart();
    this.notify('ui_changed', this.ui);
  }

  dismissOrderSuccess() {
    this.ui.orderSuccessData = null;
    this.notify('ui_changed', this.ui);
  }
}

export const store = new Store();
