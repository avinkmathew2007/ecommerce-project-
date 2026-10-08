/**
 * VÉLANE ATELIER - Product Detail & Quick View Modal Component
 */

import { store } from '../state/store.js';
import { PRODUCTS, SIZE_CHART } from '../data/products.js';
import { formatCurrency, renderStars } from '../utils/helpers.js';

let modalBackdrop = null;
let sizeGuideBackdrop = null;

export function initProductModal() {
  modalBackdrop = document.getElementById('quickview-modal-backdrop');
  sizeGuideBackdrop = document.getElementById('sizeguide-modal-backdrop');

  // Close when clicking backdrop or close button
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop || e.target.closest('.modal-close-btn')) {
        store.closeQuickView();
      }
    });
  }

  if (sizeGuideBackdrop) {
    sizeGuideBackdrop.addEventListener('click', (e) => {
      if (e.target === sizeGuideBackdrop || e.target.closest('.modal-close-btn')) {
        store.closeSizeGuide();
      }
    });
  }

  // Subscribe to store ui changes
  store.subscribe((eventType, ui) => {
    if (eventType === 'ui_changed') {
      if (ui.quickViewProductId) {
        renderQuickView(ui.quickViewProductId);
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        if (modalBackdrop) modalBackdrop.classList.remove('active');
        if (!ui.isCartOpen && !ui.isCheckoutOpen && !ui.isWishlistOpen && !ui.sizeGuideGender) {
          document.body.style.overflow = '';
        }
      }

      if (ui.sizeGuideGender) {
        renderSizeGuide(ui.sizeGuideGender);
        sizeGuideBackdrop.classList.add('active');
      } else {
        if (sizeGuideBackdrop) sizeGuideBackdrop.classList.remove('active');
      }
    }
  });
}

function renderQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modalContainer = modalBackdrop.querySelector('.modal-container');
  if (!modalContainer) return;

  let selectedColor = product.colors[0];
  let selectedSize = product.sizes[0];
  let currentQty = 1;

  function updateModalDOM() {
    const variantKey = `${selectedColor.name}-${selectedSize}`;
    const stock = product.inventory[variantKey] ?? 10;
    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock <= 3;

    modalContainer.innerHTML = `
      <button type="button" class="modal-close-btn" aria-label="Close modal">✕</button>

      <div class="quickview-layout">
        <!-- Gallery -->
        <div class="modal-gallery">
          <div class="gallery-main-view">
            <img src="${selectedColor.images[0]}" alt="${product.name}" class="gallery-main-img" id="modal-main-img" />
          </div>
          <div class="gallery-thumbnails">
            ${selectedColor.images.map((img, idx) => `
              <button type="button" class="thumb-btn ${idx === 0 ? 'active' : ''}" data-img="${img}">
                <img src="${img}" alt="${product.name} angle ${idx + 1}" />
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Product Info -->
        <div class="modal-product-info">
          <div class="modal-brand">${product.brand}</div>
          <h2 class="modal-title">${product.name}</h2>

          <div class="modal-price-wrap">
            <span class="modal-price">${formatCurrency(product.price)}</span>
            ${product.originalPrice ? `
              <span class="modal-original-price">${formatCurrency(product.originalPrice)}</span>
              <span class="modal-savings-tag">Save ${formatCurrency(product.originalPrice - product.price)}</span>
            ` : ''}
          </div>

          <div class="card-rating" style="margin-bottom: 1.25rem;">
            <span class="stars">${renderStars(product.rating)}</span>
            <span class="rating-count" style="color: var(--text-secondary); font-size: 0.8125rem;">${product.rating} / 5.0 (${product.reviewsCount} reviews)</span>
          </div>

          <p class="modal-desc">${product.description}</p>

          <!-- Variant Selectors -->
          <div class="modal-variant-section">
            <!-- Color Selector -->
            <div>
              <div class="variant-label-row">
                <span>Color: <strong class="variant-selected-val">${selectedColor.name}</strong></span>
              </div>
              <div class="modal-color-swatches">
                ${product.colors.map(color => `
                  <button type="button" 
                          class="modal-swatch-btn ${color.name === selectedColor.name ? 'active' : ''}" 
                          style="background-color: ${color.hex};" 
                          data-color="${color.name}"
                          title="${color.name}">
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Size Selector -->
            <div>
              <div class="variant-label-row">
                <span>Size: <strong class="variant-selected-val">${selectedSize}</strong></span>
                <button type="button" class="size-guide-link" id="open-size-guide-btn">Size Guide</button>
              </div>
              <div class="modal-size-pills">
                ${product.sizes.map(size => {
                  const sKey = `${selectedColor.name}-${size}`;
                  const sStock = product.inventory[sKey] ?? 10;
                  const disabled = sStock <= 0;
                  return `
                    <button type="button" 
                            class="modal-size-btn ${size === selectedSize ? 'active' : ''} ${disabled ? 'disabled' : ''}" 
                            data-size="${size}"
                            ${disabled ? 'disabled' : ''}>
                      ${size}
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Stock Alert -->
              <div class="stock-status-pill ${isOutOfStock ? 'out' : (isLowStock ? 'low' : 'available')}">
                <span class="status-indicator-dot" style="display:inline-block; width:8px; height:8px; border-radius:50%; background:currentColor;"></span>
                <span>${isOutOfStock ? 'Sold out in this variant' : (isLowStock ? `Hurry! Only ${stock} items left in stock` : 'In stock & ready to ship')}</span>
              </div>
            </div>
          </div>

          <!-- Quantity & Add to Bag -->
          <div class="modal-actions-row">
            <div class="modal-qty-stepper">
              <button type="button" class="modal-qty-btn" id="modal-qty-minus" aria-label="Decrease quantity">−</button>
              <span class="modal-qty-val" id="modal-qty-val">${currentQty}</span>
              <button type="button" class="modal-qty-btn" id="modal-qty-plus" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="modal-add-bag-btn" id="modal-add-btn" ${isOutOfStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
              ${isOutOfStock ? 'Out of Stock' : `Add to Bag • ${formatCurrency(product.price * currentQty)}`}
            </button>
          </div>

          <!-- Accordion Tabs -->
          <div class="modal-accordions">
            <div class="accordion-item active">
              <button type="button" class="accordion-trigger">
                <span>Garment Specifications & Details</span>
                <span class="accordion-icon">▾</span>
              </button>
              <div class="accordion-content">
                <ul>
                  ${product.details.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            </div>

            <div class="accordion-item">
              <button type="button" class="accordion-trigger">
                <span>Fabric & Care Instructions</span>
                <span class="accordion-icon">▾</span>
              </button>
              <div class="accordion-content">
                <ul>
                  ${product.fabricCare.map(item => `<li>${item}</li>`).join('')}
                </ul>
              </div>
            </div>

            <div class="accordion-item">
              <button type="button" class="accordion-trigger">
                <span>Complimentary Delivery & 30-Day Returns</span>
                <span class="accordion-icon">▾</span>
              </button>
              <div class="accordion-content">
                <p>Complimentary carbon-neutral express delivery across India on orders over ₹2,999. Easy returns within 30 days of receipt with reverse doorstep pickup.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach listeners inside modal
    const mainImg = modalContainer.querySelector('#modal-main-img');

    // Thumbnail switching
    modalContainer.querySelectorAll('.thumb-btn').forEach(thumb => {
      thumb.addEventListener('click', () => {
        mainImg.src = thumb.dataset.img;
        modalContainer.querySelectorAll('.thumb-btn').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    // Color Swatch clicking
    modalContainer.querySelectorAll('.modal-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cName = btn.dataset.color;
        selectedColor = product.colors.find(c => c.name === cName) || selectedColor;
        currentQty = 1;
        updateModalDOM();
      });
    });

    // Size Pill clicking
    modalContainer.querySelectorAll('.modal-size-btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedSize = btn.dataset.size;
        currentQty = 1;
        updateModalDOM();
      });
    });

    // Size Guide Link
    const sizeGuideBtn = modalContainer.querySelector('#open-size-guide-btn');
    if (sizeGuideBtn) {
      sizeGuideBtn.addEventListener('click', () => {
        store.openSizeGuide(product.gender === 'women' ? 'women' : 'men');
      });
    }

    // Qty Steppers
    const qtyVal = modalContainer.querySelector('#modal-qty-val');
    const addBtn = modalContainer.querySelector('#modal-add-btn');

    modalContainer.querySelector('#modal-qty-minus').addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyVal.textContent = currentQty;
        if (!isOutOfStock) {
          addBtn.textContent = `Add to Bag • ${formatCurrency(product.price * currentQty)}`;
        }
      }
    });

    modalContainer.querySelector('#modal-qty-plus').addEventListener('click', () => {
      if (currentQty < stock) {
        currentQty++;
        qtyVal.textContent = currentQty;
        if (!isOutOfStock) {
          addBtn.textContent = `Add to Bag • ${formatCurrency(product.price * currentQty)}`;
        }
      } else {
        store.notify('toast', { type: 'warning', message: `Only ${stock} units available in stock.` });
      }
    });

    // Add to Bag Button
    if (addBtn && !isOutOfStock) {
      addBtn.addEventListener('click', () => {
        const success = store.addToCart(product.id, selectedColor.name, selectedSize, currentQty);
        if (success) {
          store.closeQuickView();
          store.openCart();
        }
      });
    }

    // Accordion triggers
    modalContainer.querySelectorAll('.accordion-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        item.classList.toggle('active');
      });
    });
  }

  updateModalDOM();
}

function renderSizeGuide(gender = 'women') {
  const container = sizeGuideBackdrop.querySelector('.modal-container');
  if (!container) return;

  const chart = SIZE_CHART[gender] || SIZE_CHART.women;
  const isWomen = gender === 'women';

  container.innerHTML = `
    <button type="button" class="modal-close-btn" aria-label="Close size guide">✕</button>

    <div class="size-guide-modal">
      <h2 style="font-family: var(--font-editorial); font-size: 1.6rem; margin-bottom: 0.5rem;">
        Size & Measurement Guide (${isWomen ? "Women's" : "Men's / Unisex"})
      </h2>
      <p style="color: var(--text-secondary); font-size: 0.875rem;">
        All measurements are shown in standard body measurements. If you are between sizes, we recommend sizing up for relaxed silhouettes or sizing down for tailored cuts.
      </p>

      <table class="size-table">
        <thead>
          <tr>
            <th>Size</th>
            <th>${isWomen ? 'Bust' : 'Chest'}</th>
            <th>Waist</th>
            <th>${isWomen ? 'Hips' : 'Neck'}</th>
          </tr>
        </thead>
        <tbody>
          ${chart.map(row => `
            <tr>
              <td><strong>${row.size}</strong></td>
              <td>${row.bust || row.chest}</td>
              <td>${row.waist}</td>
              <td>${row.hips || row.neck}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-sm); font-size: 0.8125rem; color: var(--text-secondary);">
        <strong style="color: #fff; display: block; margin-bottom: 0.35rem;">How to Measure:</strong>
        <p>• <strong>Bust / Chest:</strong> Measure around the fullest part of your chest, keeping tape horizontal.</p>
        <p>• <strong>Waist:</strong> Measure around your natural waistline, keeping tape comfortably loose.</p>
        <p>• <strong>Hips:</strong> Measure around the fullest point of your hips with feet together.</p>
      </div>
    </div>
  `;
}
