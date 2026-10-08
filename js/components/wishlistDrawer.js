/**
 * VÉLANE ATELIER - Wishlist Drawer Component
 */

import { store } from '../state/store.js';
import { PRODUCTS } from '../data/products.js';
import { formatCurrency } from '../utils/helpers.js';

export function initWishlistDrawer() {
  const backdrop = document.getElementById('wishlist-drawer-backdrop');
  const drawer = document.getElementById('wishlist-drawer');
  const closeBtn = document.getElementById('wishlist-drawer-close');
  const itemsContainer = document.getElementById('wishlist-items-body');

  if (!drawer || !backdrop) return;

  const closeWishlist = () => store.closeWishlist();
  if (closeBtn) closeBtn.addEventListener('click', closeWishlist);
  backdrop.addEventListener('click', closeWishlist);

  function renderWishlist() {
    const savedIds = store.wishlist;
    const items = PRODUCTS.filter(p => savedIds.includes(p.id));

    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-view">
          <div class="cart-empty-icon">♡</div>
          <h3 class="cart-empty-title">Your Wishlist is Empty</h3>
          <p class="cart-empty-text">Save your favorite wardrobe pieces to track stock and shop anytime.</p>
          <button type="button" class="btn-primary" id="wishlist-empty-shop-btn">Browse Catalog</button>
        </div>
      `;

      const shopBtn = itemsContainer.querySelector('#wishlist-empty-shop-btn');
      if (shopBtn) {
        shopBtn.addEventListener('click', () => {
          store.closeWishlist();
          const catalog = document.getElementById('catalog-section');
          if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    itemsContainer.innerHTML = items.map(product => {
      const color = product.colors[0];
      const img = color.images[0];
      return `
        <div class="wishlist-item" data-product-id="${product.id}">
          <div class="wishlist-item-thumb">
            <img src="${img}" alt="${product.name}" />
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">${product.brand}</div>
            <h4 style="font-size: 0.9375rem; font-weight: 600; color: #fff;">${product.name}</h4>
            <div style="color: var(--accent-gold); font-weight: 700; margin-top: 0.2rem;">${formatCurrency(product.price)}</div>
            <button type="button" class="wishlist-move-bag-btn" data-action="quickview">Select Size & Add</button>
          </div>
          <button type="button" class="cart-item-remove-btn" data-action="remove" title="Remove from wishlist">✕</button>
        </div>
      `;
    }).join('');

    itemsContainer.querySelectorAll('.wishlist-item').forEach(el => {
      const pId = el.dataset.productId;
      el.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.dataset.action;
        if (action === 'remove') {
          store.toggleWishlist(pId);
        } else if (action === 'quickview') {
          store.closeWishlist();
          store.openQuickView(pId);
        }
      });
    });
  }

  store.subscribe((eventType, payload, currentStore) => {
    if (eventType === 'wishlist_updated') {
      renderWishlist();
    }

    if (eventType === 'ui_changed') {
      const ui = currentStore.ui;
      if (ui.isWishlistOpen) {
        renderWishlist();
        backdrop.classList.add('active');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        backdrop.classList.remove('active');
        drawer.classList.remove('active');
        if (!ui.quickViewProductId && !ui.isCheckoutOpen && !ui.isCartOpen && !ui.sizeGuideGender) {
          document.body.style.overflow = '';
        }
      }
    }
  });

  renderWishlist();
}
