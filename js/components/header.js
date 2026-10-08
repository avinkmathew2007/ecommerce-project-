/**
 * VÉLANE ATELIER - Header & Navigation Component
 */

import { store } from '../state/store.js';
import { debounce } from '../utils/helpers.js';

export function initHeader() {
  const searchInput = document.getElementById('header-search-input');
  const cartBtn = document.getElementById('header-cart-btn');
  const wishlistBtn = document.getElementById('header-wishlist-btn');
  const cartBadge = document.getElementById('cart-badge-count');
  const wishlistBadge = document.getElementById('wishlist-badge-count');

  // Mobile nav buttons
  const mobCatalogBtn = document.getElementById('mob-nav-catalog');
  const mobWishlistBtn = document.getElementById('mob-nav-wishlist');
  const mobCartBtn = document.getElementById('mob-nav-cart');
  const mobCartBadge = document.getElementById('mob-cart-badge');

  // Search Input with Debounce
  if (searchInput) {
    const handleSearch = debounce((query) => {
      store.setFilter('searchQuery', query);
    }, 200);

    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }

  // Cart Button
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      store.openCart();
    });
  }

  // Wishlist Button
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      store.openWishlist();
    });
  }

  // Mobile Nav Buttons
  if (mobCatalogBtn) {
    mobCatalogBtn.addEventListener('click', () => {
      const catalogEl = document.getElementById('catalog-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (mobWishlistBtn) {
    mobWishlistBtn.addEventListener('click', () => {
      store.openWishlist();
    });
  }

  if (mobCartBtn) {
    mobCartBtn.addEventListener('click', () => {
      store.openCart();
    });
  }

  // Update badge counts on state changes
  function updateBadges() {
    const totals = store.getCartTotals();
    const cartCount = totals.itemCount;
    const wishlistCount = store.wishlist.length;

    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }

    if (mobCartBadge) {
      mobCartBadge.textContent = cartCount;
      mobCartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }

    if (wishlistBadge) {
      wishlistBadge.textContent = wishlistCount;
      wishlistBadge.style.display = wishlistCount > 0 ? 'flex' : 'none';
    }
  }

  store.subscribe((eventType) => {
    if (eventType === 'cart_updated' || eventType === 'wishlist_updated') {
      updateBadges();
    }
  });

  updateBadges();
}
