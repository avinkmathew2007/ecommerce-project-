/**
 * VÉLANE ATELIER - Main Application Orchestrator
 */

import { store } from './state/store.js';
import { initHeader } from './components/header.js';
import { initFilters } from './components/filters.js';
import { renderProductCard } from './components/productCard.js';
import { initProductModal } from './components/productModal.js';
import { initCartDrawer } from './components/cartDrawer.js';
import { initCheckoutModal } from './components/checkoutModal.js';
import { initWishlistDrawer } from './components/wishlistDrawer.js';
import { showToast } from './components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Components
  initHeader();
  initFilters();
  initProductModal();
  initCartDrawer();
  initCheckoutModal();
  initWishlistDrawer();

  // Grid container & results counter
  const productsGrid = document.getElementById('products-grid');
  const resultsCount = document.getElementById('results-count-text');

  // Hero CTA scroll
  const heroShopBtn = document.getElementById('hero-shop-cta');
  if (heroShopBtn) {
    heroShopBtn.addEventListener('click', () => {
      const catalog = document.getElementById('catalog-section');
      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Render Product Catalog Grid
  function renderCatalog() {
    if (!productsGrid) return;

    const filtered = store.getFilteredProducts();

    if (resultsCount) {
      resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'garment' : 'garments'}`;
    }

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="catalog-empty">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No Garments Found</h3>
          <p class="empty-sub">We couldn't find any pieces matching your current filter selections.</p>
          <button type="button" class="btn-secondary" id="empty-reset-filters-btn">Clear All Filters</button>
        </div>
      `;

      const resetBtn = productsGrid.querySelector('#empty-reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          store.resetFilters();
        });
      }
      return;
    }

    productsGrid.innerHTML = '';
    filtered.forEach(product => {
      const cardEl = renderProductCard(product);
      productsGrid.appendChild(cardEl);
    });
  }

  // Listen to store events
  store.subscribe((eventType, payload) => {
    if (eventType === 'toast') {
      showToast(payload.message, payload.type);
    }

    if (eventType === 'filters_changed' || eventType === 'wishlist_updated') {
      renderCatalog();
    }
  });

  // Initial render
  renderCatalog();
  console.log('✦ VÉLANE ATELIER E-Commerce App initialized.');
});
