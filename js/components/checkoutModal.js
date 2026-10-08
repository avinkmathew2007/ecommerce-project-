/**
 * VÉLANE ATELIER - Checkout & Order Processing Modal Component
 */

import { store } from '../state/store.js';
import { formatCurrency, generateId } from '../utils/helpers.js';

let checkoutBackdrop = null;
let receiptBackdrop = null;

export function initCheckoutModal() {
  checkoutBackdrop = document.getElementById('checkout-modal-backdrop');
  receiptBackdrop = document.getElementById('receipt-modal-backdrop');

  if (!checkoutBackdrop || !receiptBackdrop) return;

  // Backdrop close handling
  checkoutBackdrop.addEventListener('click', (e) => {
    if (e.target === checkoutBackdrop || e.target.closest('.modal-close-btn')) {
      store.closeCheckout();
    }
  });

  receiptBackdrop.addEventListener('click', (e) => {
    if (e.target === receiptBackdrop || e.target.closest('.modal-close-btn') || e.target.closest('#receipt-continue-btn')) {
      store.dismissOrderSuccess();
    }
  });

  // Listen to UI changes
  store.subscribe((eventType, ui) => {
    if (eventType === 'ui_changed') {
      if (ui.isCheckoutOpen) {
        renderCheckout();
        checkoutBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        checkoutBackdrop.classList.remove('active');
      }

      if (ui.orderSuccessData) {
        renderReceipt(ui.orderSuccessData);
        receiptBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        receiptBackdrop.classList.remove('active');
        if (!ui.isCartOpen && !ui.isCheckoutOpen && !ui.quickViewProductId && !ui.isWishlistOpen) {
          document.body.style.overflow = '';
        }
      }
    }
  });
}

function renderCheckout() {
  const container = checkoutBackdrop.querySelector('.modal-container');
  if (!container) return;

  const totals = store.getCartTotals();
  const items = store.cart;

  container.innerHTML = `
    <button type="button" class="modal-close-btn" aria-label="Close checkout">✕</button>

    <div class="checkout-modal">
      <h2 style="font-family: var(--font-editorial); font-size: 1.85rem; margin-bottom: 1.75rem;">
        Express Secure Checkout
      </h2>

      <div class="checkout-grid">
        <!-- Forms -->
        <div>
          <form id="checkout-form">
            <!-- Shipping Information -->
            <div style="margin-bottom: 2rem;">
              <h3 class="checkout-section-title">
                <span>1. Shipping Address</span>
              </h3>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="chk-first-name">First Name</label>
                  <input type="text" id="chk-first-name" class="form-input" placeholder="Elena" required value="Elena" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="chk-last-name">Last Name</label>
                  <input type="text" id="chk-last-name" class="form-input" placeholder="Vance" required value="Vance" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="chk-email">Email Address</label>
                <input type="email" id="chk-email" class="form-input" placeholder="elena.vance@example.com" required value="elena.vance@example.com" />
              </div>

              <div class="form-group">
                <label class="form-label" for="chk-address">Street Address</label>
                <input type="text" id="chk-address" class="form-input" placeholder="742 Evergreen Terrace" required value="742 Evergreen Terrace" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="chk-city">City</label>
                  <input type="text" id="chk-city" class="form-input" placeholder="New York" required value="New York" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="chk-zip">Postal / Zip Code</label>
                  <input type="text" id="chk-zip" class="form-input" placeholder="10001" required value="10001" />
                </div>
              </div>
            </div>

            <!-- Payment Simulation -->
            <div>
              <h3 class="checkout-section-title">
                <span>2. Payment Details</span>
              </h3>

              <!-- Live Card Graphic -->
              <div class="mock-credit-card">
                <div class="card-chip"></div>
                <div class="card-num-preview" id="preview-card-num">•••• •••• •••• 4242</div>
                <div class="card-holder-row">
                  <div>
                    <span style="font-size: 0.65rem; display:block; opacity: 0.7;">Cardholder</span>
                    <strong id="preview-card-name">Elena Vance</strong>
                  </div>
                  <div>
                    <span style="font-size: 0.65rem; display:block; opacity: 0.7;">Expires</span>
                    <span>12/28</span>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="chk-card-num">Card Number</label>
                <input type="text" id="chk-card-num" class="form-input" placeholder="4242 •••• •••• 4242" required value="4242 8890 1234 4242" maxlength="19" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="chk-card-exp">Expiry (MM/YY)</label>
                  <input type="text" id="chk-card-exp" class="form-input" placeholder="12/28" required value="12/28" maxlength="5" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="chk-card-cvc">CVC</label>
                  <input type="text" id="chk-card-cvc" class="form-input" placeholder="888" required value="888" maxlength="4" />
                </div>
              </div>
            </div>

            <button type="submit" class="btn-primary" id="place-order-submit-btn" style="width: 100%; margin-top: 1.5rem; height: 52px; font-size: 1rem;">
              <span>Authorize & Place Order • ${formatCurrency(totals.total)}</span>
            </button>
          </form>
        </div>

        <!-- Order Summary Column -->
        <div style="background: var(--bg-surface-elevated); padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); height: fit-content;">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 0.05em;">Order Summary</h3>

          <div style="max-height: 220px; overflow-y: auto; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
            ${items.map(item => `
              <div style="display: flex; gap: 0.75rem; align-items: center; font-size: 0.8125rem;">
                <img src="${item.image}" alt="${item.name}" style="width: 48px; aspect-ratio: 3/4; object-fit: cover; border-radius: var(--radius-xs);" />
                <div style="flex: 1;">
                  <div style="font-weight: 600; color: #fff;">${item.name}</div>
                  <div style="color: var(--text-muted); font-size: 0.75rem;">Qty: ${item.quantity} • ${item.selectedSize} / ${item.selectedColor}</div>
                </div>
                <div style="font-weight: 600; color: var(--accent-gold);">${formatCurrency(item.price * item.quantity)}</div>
              </div>
            `).join('')}
          </div>

          <div class="price-breakdown" style="padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
            <div class="breakdown-row">
              <span>Subtotal</span>
              <span>${formatCurrency(totals.subtotal)}</span>
            </div>
            ${totals.discount > 0 ? `
              <div class="breakdown-row discount-row">
                <span>Discount</span>
                <span>−${formatCurrency(totals.discount)}</span>
              </div>
            ` : ''}
            <div class="breakdown-row">
              <span>Shipping</span>
              <span>${totals.shipping === 0 ? '<strong style="color: var(--status-success);">FREE</strong>' : formatCurrency(totals.shipping)}</span>
            </div>
            <div class="breakdown-row">
              <span>Estimated Tax</span>
              <span>${formatCurrency(totals.tax)}</span>
            </div>
            <div class="breakdown-row total-row">
              <span>Total</span>
              <span style="color: var(--accent-gold); font-size: 1.3rem;">${formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Submit handling
  const form = container.querySelector('#checkout-form');
  const submitBtn = container.querySelector('#place-order-submit-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Processing Authorization...</span>`;

    setTimeout(() => {
      const orderData = {
        orderId: `VEL-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [...store.cart],
        totals: { ...totals },
        customer: {
          name: `${container.querySelector('#chk-first-name').value} ${container.querySelector('#chk-last-name').value}`,
          email: container.querySelector('#chk-email').value,
          address: `${container.querySelector('#chk-address').value}, ${container.querySelector('#chk-city').value} ${container.querySelector('#chk-zip').value}`
        }
      };

      store.closeCheckout();
      store.setOrderSuccess(orderData);
    }, 1200);
  });
}

function renderReceipt(orderData) {
  const container = receiptBackdrop.querySelector('.modal-container');
  if (!container) return;

  container.innerHTML = `
    <button type="button" class="modal-close-btn" aria-label="Close receipt">✕</button>

    <div class="order-success-modal">
      <div class="success-check-icon">✓</div>
      <h2 style="font-family: var(--font-editorial); font-size: 2rem; margin-bottom: 0.5rem;">
        Order Confirmed!
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.9375rem;">
        Thank you for your purchase, <strong>${orderData.customer.name}</strong>. A confirmation email with tracking has been sent to <strong>${orderData.customer.email}</strong>.
      </p>

      <div class="order-receipt-id">Order Reference: ${orderData.orderId}</div>

      <div style="background: var(--bg-surface-elevated); padding: 1.5rem; border-radius: var(--radius-md); text-align: left; margin-bottom: 2rem; font-size: 0.875rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
          <span style="color: var(--text-secondary);">Date Placed</span>
          <strong>${orderData.date}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
          <span style="color: var(--text-secondary);">Delivering To</span>
          <span style="text-align: right; max-width: 260px;">${orderData.customer.address}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-subtle);">
          <span style="color: var(--text-secondary);">Payment Method</span>
          <span>Visa ending in 4242</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.05rem; color: #fff;">
          <span>Total Charged</span>
          <span style="color: var(--accent-gold);">${formatCurrency(orderData.totals.total)}</span>
        </div>
      </div>

      <button type="button" class="btn-primary" id="receipt-continue-btn" style="width: 100%;">
        Continue Exploring Collections
      </button>
    </div>
  `;
}
