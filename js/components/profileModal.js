/**
 * VÉLANE ATELIER - User Profile Component
 * Interactive account dashboard, order history, address book & VIP privileges
 */

import { store } from '../state/store.js';
import { formatCurrency } from '../utils/helpers.js';

let profileBackdrop = null;

export function initProfileModal() {
  profileBackdrop = document.getElementById('profile-modal-backdrop');
  if (!profileBackdrop) return;

  // Backdrop click to close
  profileBackdrop.addEventListener('click', (e) => {
    if (e.target === profileBackdrop || e.target.closest('.modal-close-btn')) {
      store.closeProfile();
    }
  });

  // Re-render when UI or user state changes
  store.subscribe((eventType, payload, currentStore) => {
    if (eventType === 'ui_changed' || eventType === 'user_updated') {
      const ui = currentStore.ui;
      if (ui.isProfileOpen) {
        renderProfileModal(ui.profileActiveTab || 'orders');
        profileBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        profileBackdrop.classList.remove('active');
        if (!ui.isCartOpen && !ui.isCheckoutOpen && !ui.quickViewProductId && !ui.isWishlistOpen) {
          document.body.style.overflow = '';
        }
      }
    }
  });
}

function renderProfileModal(activeTab = 'orders') {
  const container = profileBackdrop.querySelector('.modal-container');
  if (!container) return;

  const user = store.user;
  const ordersCount = user.orders?.length || 0;
  const totalSpent = (user.orders || []).reduce((sum, ord) => sum + (ord.totals?.total || 0), 0);

  container.innerHTML = `
    <button type="button" class="modal-close-btn" aria-label="Close profile">✕</button>

    <div class="profile-modal">
      <!-- Profile Hero Banner -->
      <div class="profile-header-banner">
        <div class="profile-user-summary">
          <div class="profile-avatar-wrap">
            <img src="${user.avatar}" alt="${user.name}" class="profile-avatar-img" />
          </div>
          <div>
            <h2 class="profile-user-name">${user.name}</h2>
            <div class="profile-user-email">${user.email} • Client since ${user.memberSince}</div>
            <div class="profile-vip-badge">
              <span>✦</span>
              <span>${user.tier}</span>
            </div>
          </div>
        </div>

        <div class="profile-quick-stats">
          <div class="stat-item">
            <span class="stat-num">${ordersCount}</span>
            <span class="stat-lbl">Curations Placed</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">${formatCurrency(totalSpent)}</span>
            <span class="stat-lbl">Lifetime Value</span>
          </div>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="profile-nav-tabs">
        <button type="button" class="profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders">
          Order History (${ordersCount})
        </button>
        <button type="button" class="profile-tab-btn ${activeTab === 'details' ? 'active' : ''}" data-tab="details">
          Personal Information
        </button>
        <button type="button" class="profile-tab-btn ${activeTab === 'addresses' ? 'active' : ''}" data-tab="addresses">
          Address Book (${user.addresses.length})
        </button>
        <button type="button" class="profile-tab-btn ${activeTab === 'vip' ? 'active' : ''}" data-tab="vip">
          Atelier VIP Privileges
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="profile-content-body">
        ${renderTabContent(activeTab, user)}
      </div>
    </div>
  `;

  // Attach tab switching events
  container.querySelectorAll('.profile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      store.setProfileTab(tab);
    });
  });

  // Attach tab-specific handlers
  attachTabActions(container, activeTab, user);
}

function renderTabContent(tab, user) {
  switch (tab) {
    case 'details':
      return `
        <div>
          <h3 style="font-family: var(--font-editorial); font-size: 1.35rem; margin-bottom: 0.5rem; color: #fff;">
            Personal Details & Fit Profile
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.8125rem; margin-bottom: 2rem;">
            Manage your personal profile and preferred garment sizing for tailored recommendations.
          </p>

          <form id="profile-details-form">
            <div class="profile-form-grid">
              <div class="form-group">
                <label class="form-label" for="prof-name">Full Name</label>
                <input type="text" id="prof-name" class="form-input" value="${user.name}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-email">Email Address</label>
                <input type="email" id="prof-email" class="form-input" value="${user.email}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-phone">Phone Number</label>
                <input type="tel" id="prof-phone" class="form-input" value="${user.phone}" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-size">Preferred Sizing</label>
                <select id="prof-size" class="form-input" style="background: var(--bg-surface-elevated); cursor: pointer;">
                  ${['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => `
                    <option value="${s}" ${user.defaultSize === s ? 'selected' : ''}>Size ${s}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <button type="submit" class="profile-save-btn">
              Save Profile Changes
            </button>
          </form>
        </div>
      `;

    case 'addresses':
      return `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem;">
            <div>
              <h3 style="font-family: var(--font-editorial); font-size: 1.35rem; color: #fff;">
                Saved Delivery Addresses
              </h3>
              <p style="color: var(--text-secondary); font-size: 0.8125rem;">
                Manage verified delivery destinations for single-click express checkout.
              </p>
            </div>
            <button type="button" class="btn-secondary" id="open-add-address-btn" style="font-size: 0.75rem; padding: 0.5rem 1rem;">
              + Add New Address
            </button>
          </div>

          <!-- Add Address Form (Hidden by default) -->
          <div id="add-address-form-box" style="display: none; background: var(--bg-surface-elevated); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 1.5rem; margin-bottom: 2rem;">
            <h4 style="font-size: 1rem; margin-bottom: 1rem; color: #fff;">Add New Shipping Address</h4>
            <form id="new-address-form">
              <div class="profile-form-grid">
                <div class="form-group">
                  <label class="form-label" for="addr-title">Address Label (e.g., Home, Studio)</label>
                  <input type="text" id="addr-title" class="form-input" placeholder="Summer House" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="addr-street">Street Address</label>
                  <input type="text" id="addr-street" class="form-input" placeholder="Flat 402, Sea Green Apts" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="addr-city">City</label>
                  <input type="text" id="addr-city" class="form-input" placeholder="Mumbai" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="addr-zip">Postal / PIN Code</label>
                  <input type="text" id="addr-zip" class="form-input" placeholder="400050" required />
                </div>
              </div>
              <div style="display: flex; gap: 0.75rem;">
                <button type="submit" class="profile-save-btn">Save Address</button>
                <button type="button" class="btn-secondary" id="cancel-add-address-btn" style="font-size: 0.8125rem;">Cancel</button>
              </div>
            </form>
          </div>

          <div class="addresses-grid">
            ${user.addresses.map(addr => `
              <div class="address-card" data-address-id="${addr.id}">
                ${addr.isDefault ? `<span class="address-default-badge">Primary</span>` : ''}
                <h4 class="address-title">${addr.title}</h4>
                <div class="address-text">
                  ${addr.street}<br />
                  ${addr.city}, ${addr.state || ''} ${addr.zip}
                </div>
                ${!addr.isDefault ? `
                  <button type="button" class="address-delete-btn" data-delete-id="${addr.id}">Remove Address</button>
                ` : `<span style="font-size: 0.75rem; color: var(--text-muted);">Default checkout address</span>`}
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'vip':
      return `
        <div>
          <!-- VIP Membership Virtual Card -->
          <div class="vip-card-banner">
            <div class="vip-card-chip"></div>
            <div style="font-family: var(--font-editorial); font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem; letter-spacing: 0.05em;">
              VÉLANE ATELIER • GOLD VIP CLIENTELE
            </div>
            <div style="font-family: monospace; font-size: 1.1rem; color: var(--accent-gold); letter-spacing: 0.15em; margin-bottom: 1.5rem;">
              MEMBER #VEL-GOLD-202488
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em;">
              <div>
                <span>Cardholder</span>
                <strong style="color: #fff; display: block; margin-top: 0.2rem;">${user.name}</strong>
              </div>
              <div style="text-align: right;">
                <span>Valid Worldwide</span>
                <strong style="color: var(--accent-gold); display: block; margin-top: 0.2rem;">Lifetime VIP</strong>
              </div>
            </div>
          </div>

          <h3 style="font-family: var(--font-editorial); font-size: 1.25rem; margin-bottom: 1.25rem; color: #fff;">
            Exclusive Tier Privileges
          </h3>

          <div class="vip-perks-grid">
            <div class="vip-perk-item">
              <h4 class="vip-perk-title"><span>✈️</span> Complimentary Express Shipping</h4>
              <p class="vip-perk-desc">Zero shipping fees across all domestic orders with no minimum cart requirement.</p>
            </div>
            <div class="vip-perk-item">
              <h4 class="vip-perk-title"><span>✦</span> 48h Capsule Pre-Launch Access</h4>
              <p class="vip-perk-desc">Private preview links before limited seasonal runs are unlocked for the public.</p>
            </div>
            <div class="vip-perk-item">
              <h4 class="vip-perk-title"><span>🧵</span> Complimentary Sizing & Alterations</h4>
              <p class="vip-perk-desc">Direct access to atelier sartorialists for hem adjustments and garment consultations.</p>
            </div>
            <div class="vip-perk-item">
              <h4 class="vip-perk-title"><span>🥂</span> Dedicated Personal Stylist</h4>
              <p class="vip-perk-desc">One-on-one styling concierge reachable anytime via WhatsApp or email.</p>
            </div>
          </div>
        </div>
      `;

    case 'orders':
    default:
      if (!user.orders || user.orders.length === 0) {
        return `
          <div class="cart-empty-view">
            <div class="cart-empty-icon">📦</div>
            <h3 class="cart-empty-title">No Orders Placed Yet</h3>
            <p class="cart-empty-text">Your bespoke garment purchases and order tracking will appear here.</p>
            <button type="button" class="btn-primary" id="prof-shop-now-btn">Explore Collections</button>
          </div>
        `;
      }

      return `
        <div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-editorial); font-size: 1.35rem; color: #fff;">
              Past Purchases & Tracking
            </h3>
            <span style="font-size: 0.8125rem; color: var(--text-secondary);">
              Showing ${user.orders.length} ${user.orders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>

          <div class="order-history-list">
            ${user.orders.map(order => `
              <div class="order-card">
                <div class="order-card-header">
                  <div class="order-id-date">
                    <span class="order-id-num">${order.orderId}</span>
                    <span class="order-date-text">${order.date}</span>
                  </div>
                  <span class="order-status-pill ${order.statusColor || 'info'}">
                    ● ${order.status || 'Confirmed'}
                  </span>
                </div>

                <div class="order-items-preview">
                  ${(order.items || []).map(item => `
                    <div class="order-item-row">
                      <div class="order-item-main">
                        <img src="${item.image}" alt="${item.name}" class="order-item-img" />
                        <div>
                          <strong style="color: #fff;">${item.name}</strong>
                          <div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.15rem;">
                            Qty: ${item.quantity} • ${item.selectedSize} / ${item.selectedColor}
                          </div>
                        </div>
                      </div>
                      <div style="font-weight: 600; color: var(--accent-gold);">
                        ${formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  `).join('')}
                </div>

                <div class="order-card-footer">
                  <div class="order-tracking-info">
                    Tracking AWB: <strong>${order.trackingNumber || 'DTDC-48921820IN'}</strong>
                  </div>
                  <div style="display: flex; align-items: center; gap: 1.25rem;">
                    <span class="order-total-amount">Total: ${formatCurrency(order.totals?.total || 0)}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
  }
}

function attachTabActions(container, activeTab, user) {
  // Empty shop now button
  const emptyShopBtn = container.querySelector('#prof-shop-now-btn');
  if (emptyShopBtn) {
    emptyShopBtn.addEventListener('click', () => {
      store.closeProfile();
      const catalog = document.getElementById('catalog-section');
      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Personal details form submit
  if (activeTab === 'details') {
    const form = container.querySelector('#profile-details-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          name: container.querySelector('#prof-name').value.trim(),
          email: container.querySelector('#prof-email').value.trim(),
          phone: container.querySelector('#prof-phone').value.trim(),
          defaultSize: container.querySelector('#prof-size').value
        };
        store.updateUserProfile(updated);
      });
    }
  }

  // Address book actions
  if (activeTab === 'addresses') {
    const openAddBtn = container.querySelector('#open-add-address-btn');
    const cancelAddBtn = container.querySelector('#cancel-add-address-btn');
    const formBox = container.querySelector('#add-address-form-box');
    const newAddressForm = container.querySelector('#new-address-form');

    if (openAddBtn && formBox) {
      openAddBtn.addEventListener('click', () => {
        formBox.style.display = formBox.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (cancelAddBtn && formBox) {
      cancelAddBtn.addEventListener('click', () => {
        formBox.style.display = 'none';
      });
    }

    if (newAddressForm) {
      newAddressForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const addrData = {
          title: container.querySelector('#addr-title').value.trim(),
          street: container.querySelector('#addr-street').value.trim(),
          city: container.querySelector('#addr-city').value.trim(),
          zip: container.querySelector('#addr-zip').value.trim()
        };
        store.addAddress(addrData);
      });
    }

    // Delete address buttons
    container.querySelectorAll('[data-delete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const addrId = btn.dataset.deleteId;
        store.deleteAddress(addrId);
      });
    });
  }
}
