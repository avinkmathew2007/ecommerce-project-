/**
 * VÉLANE ATELIER - Slide-out Cart Drawer Component
 */

import { store } from '../state/store.js';
import { formatCurrency } from '../utils/helpers.js';

export function initCartDrawer() {
  const backdrop = document.getElementById('cart-drawer-backdrop');
  const drawer = document.getElementById('cart-drawer');
  const closeBtn = document.getElementById('cart-drawer-close');
  const countBadge = document.getElementById('cart-drawer-count');
  const itemsContainer = document.getElementById('cart-items-body');
  const footerContainer = document.getElementById('cart-drawer-footer');
  const shippingMeter = document.getElementById('free-shipping-meter');

  if (!drawer || !backdrop) return;

  // Close triggers
  const closeCart = () => store.closeCart();
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  backdrop.addEventListener('click', closeCart);

  // Re-render cart on changes
  function renderCart() {
    const totals = store.getCartTotals();
    const items = store.cart;

    // Update count in header
    if (countBadge) {
      countBadge.textContent = `(${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'})`;
    }

    // Update Free Shipping Progress Bar
    if (shippingMeter) {
      if (items.length === 0) {
        shippingMeter.innerHTML = `
          <div class="shipping-status-msg">
            <span>Add items worth <span class="highlight">${formatCurrency(totals.freeShippingThreshold)}</span> for FREE worldwide delivery</span>
          </div>
          <div class="progress-track"><div class="progress-bar" style="width: 0%;"></div></div>
        `;
      } else if (totals.qualifiesForFreeShipping) {
        shippingMeter.innerHTML = `
          <div class="shipping-status-msg" style="color: var(--status-success);">
            <span>✦ Congratulations! You've unlocked <strong>FREE Express Shipping</strong></span>
          </div>
          <div class="progress-track"><div class="progress-bar" style="width: 100%; background: var(--status-success);"></div></div>
        `;
      } else {
        shippingMeter.innerHTML = `
          <div class="shipping-status-msg">
            <span>Add <span class="highlight">${formatCurrency(totals.amountToFreeShipping)}</span> more to unlock <strong>FREE Express Shipping</strong></span>
          </div>
          <div class="progress-track"><div class="progress-bar" style="width: ${totals.freeShippingProgress}%;"></div></div>
        `;
      }
    }

    // Render Items
    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-view">
          <div class="cart-empty-icon">🛍️</div>
          <h3 class="cart-empty-title">Your Bag is Empty</h3>
          <p class="cart-empty-text">Discover modern luxury silhouettes crafted with archival craftsmanship.</p>
          <button type="button" class="btn-primary" id="cart-empty-shop-btn">Explore Collections</button>
        </div>
      `;

      const emptyShopBtn = itemsContainer.querySelector('#cart-empty-shop-btn');
      if (emptyShopBtn) {
        emptyShopBtn.addEventListener('click', () => {
          store.closeCart();
          const catalog = document.getElementById('catalog-section');
          if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
        });
      }

      if (footerContainer) footerContainer.style.display = 'none';
      return;
    }

    if (footerContainer) footerContainer.style.display = 'flex';

    itemsContainer.innerHTML = items.map(item => `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.name}" />
        </div>

        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <div class="cart-item-meta">
            <span class="meta-color-dot" style="background-color: ${item.selectedColorHex || '#888'};"></span>
            <span>${item.selectedColor}</span>
            <span>•</span>
            <span>Size ${item.selectedSize}</span>
          </div>
          <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>

          <div class="qty-stepper">
            <button type="button" class="qty-btn" data-action="minus" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button type="button" class="qty-btn" data-action="plus" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <button type="button" class="cart-item-remove-btn" data-action="remove" title="Remove item" aria-label="Remove item">✕</button>
      </div>
    `).join('');

    // Attach item action handlers
    itemsContainer.querySelectorAll('.cart-item').forEach(el => {
      const itemId = el.dataset.itemId;
      const currentItem = items.find(i => i.id === itemId);
      if (!currentItem) return;

      el.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const action = actionBtn.dataset.action;
        if (action === 'minus') {
          store.updateCartQuantity(itemId, currentItem.quantity - 1);
        } else if (action === 'plus') {
          store.updateCartQuantity(itemId, currentItem.quantity + 1);
        } else if (action === 'remove') {
          store.removeFromCart(itemId);
        }
      });
    });

    // Render Footer (Promo Code & Breakdown)
    footerContainer.innerHTML = `
      <!-- Promo Section -->
      ${store.appliedPromo ? `
        <div class="active-promo-tag">
          <span>✓ Applied: ${store.appliedPromo.code} (${store.appliedPromo.description})</span>
          <button type="button" class="promo-remove-btn" id="remove-promo-btn" aria-label="Remove coupon">✕</button>
        </div>
      ` : `
        <div class="promo-box">
          <input type="text" class="promo-input" id="cart-promo-input" placeholder="Promo code (e.g. WELCOME15)" />
          <button type="button" class="promo-apply-btn" id="cart-promo-apply-btn">Apply</button>
        </div>
      `}

      <!-- Price Breakdown -->
      <div class="price-breakdown">
        <div class="breakdown-row">
          <span>Subtotal</span>
          <span>${formatCurrency(totals.subtotal)}</span>
        </div>
        ${totals.discount > 0 ? `
          <div class="breakdown-row discount-row">
            <span>Promotional Discount</span>
            <span>−${formatCurrency(totals.discount)}</span>
          </div>
        ` : ''}
        <div class="breakdown-row">
          <span>Estimated Shipping</span>
          <span>${totals.shipping === 0 ? '<span style="color: var(--status-success); font-weight: 600;">FREE</span>' : formatCurrency(totals.shipping)}</span>
        </div>
        <div class="breakdown-row">
          <span>Estimated Sales Tax</span>
          <span>${formatCurrency(totals.tax)}</span>
        </div>
        <div class="breakdown-row total-row">
          <span>Estimated Total</span>
          <span>${formatCurrency(totals.total)}</span>
        </div>
      </div>

      <button type="button" class="checkout-btn" id="cart-proceed-checkout-btn">
        <span>Proceed to Checkout</span>
        <span aria-hidden="true">→</span>
      </button>
    `;

    // Promo code event bindings
    const promoInput = footerContainer.querySelector('#cart-promo-input');
    const promoApplyBtn = footerContainer.querySelector('#cart-promo-apply-btn');
    const promoRemoveBtn = footerContainer.querySelector('#remove-promo-btn');
    const checkoutBtn = footerContainer.querySelector('#cart-proceed-checkout-btn');

    if (promoApplyBtn && promoInput) {
      promoApplyBtn.addEventListener('click', () => {
        store.applyPromoCode(promoInput.value);
      });
      promoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          store.applyPromoCode(promoInput.value);
        }
      });
    }

    if (promoRemoveBtn) {
      promoRemoveBtn.addEventListener('click', () => {
        store.removePromoCode();
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        store.openCheckout();
      });
    }
  }

  // Subscribe to UI & Cart state changes
  store.subscribe((eventType, payload, currentStore) => {
    if (eventType === 'cart_updated') {
      renderCart();
    }

    if (eventType === 'ui_changed') {
      const ui = currentStore.ui;
      if (ui.isCartOpen) {
        renderCart();
        backdrop.classList.add('active');
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        backdrop.classList.remove('active');
        drawer.classList.remove('active');
        if (!ui.quickViewProductId && !ui.isCheckoutOpen && !ui.isWishlistOpen && !ui.sizeGuideGender) {
          document.body.style.overflow = '';
        }
      }
    }
  });

  renderCart();
}
