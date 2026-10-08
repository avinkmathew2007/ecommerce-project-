/**
 * VÉLANE ATELIER - Product Card Component
 */

import { store } from '../state/store.js';
import { formatCurrency, renderStars } from '../utils/helpers.js';

export function renderProductCard(product) {
  const isWishlisted = store.isInWishlist(product.id);
  const defaultColor = product.colors[0];
  const initialImage = defaultColor.images[0];

  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.productId = product.id;

  card.innerHTML = `
    <div class="card-media-wrap">
      ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
      <button type="button" class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" aria-label="Save to wishlist" data-action="wishlist">
        <span aria-hidden="true">${isWishlisted ? '♥' : '♡'}</span>
      </button>
      <img src="${initialImage}" alt="${product.name}" class="card-img" loading="lazy" />
      <button type="button" class="card-quick-view-btn" data-action="quickview">Quick View</button>
    </div>

    <div class="card-content">
      <div class="card-swatches" aria-label="Available Colors">
        ${product.colors.map((color, idx) => `
          <button type="button" 
                  class="swatch-dot ${idx === 0 ? 'active' : ''}" 
                  style="background-color: ${color.hex};" 
                  title="${color.name}" 
                  data-action="swatch" 
                  data-img="${color.images[0]}" 
                  aria-label="Color ${color.name}">
          </button>
        `).join('')}
      </div>

      <div class="card-brand">${product.brand}</div>
      <h3 class="card-title" data-action="quickview">${product.name}</h3>

      <div class="card-rating">
        <span class="stars">${renderStars(product.rating)}</span>
        <span class="rating-count">(${product.reviewsCount})</span>
      </div>

      <div class="card-footer">
        <div class="card-pricing">
          <span class="price-current">${formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original">${formatCurrency(product.originalPrice)}</span>` : ''}
        </div>
        <button type="button" class="card-add-btn" data-action="quickadd">
          <span>+ Add</span>
        </button>
      </div>
    </div>
  `;

  // Attach event handlers
  const imgEl = card.querySelector('.card-img');
  const wishlistBtn = card.querySelector('.card-wishlist-btn');

  // Swatch interactions
  card.querySelectorAll('.swatch-dot').forEach(swatch => {
    const swapImg = () => {
      const targetImg = swatch.dataset.img;
      if (imgEl && targetImg) {
        imgEl.src = targetImg;
        card.querySelectorAll('.swatch-dot').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      }
    };

    swatch.addEventListener('click', (e) => {
      e.stopPropagation();
      swapImg();
    });

    swatch.addEventListener('mouseenter', swapImg);
  });

  // Card click actions
  card.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;

    if (action === 'wishlist') {
      e.stopPropagation();
      store.toggleWishlist(product.id);
      const isNowIn = store.isInWishlist(product.id);
      wishlistBtn.classList.toggle('active', isNowIn);
      wishlistBtn.innerHTML = `<span aria-hidden="true">${isNowIn ? '♥' : '♡'}</span>`;
    } else if (action === 'quickview' || action === 'quickadd') {
      e.stopPropagation();
      store.openQuickView(product.id);
    }
  });

  return card;
}
