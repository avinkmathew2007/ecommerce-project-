/**
 * VÉLANE ATELIER - Filter & Sorting Controls Component
 */

import { store } from '../state/store.js';
import { CATEGORIES, SIZES } from '../data/products.js';
import { formatCurrency } from '../utils/helpers.js';

export function initFilters() {
  const categoryChipsContainer = document.getElementById('category-chips-list');
  const sizePillsContainer = document.getElementById('size-pills-container');
  const priceSlider = document.getElementById('filter-price-slider');
  const priceDisplay = document.getElementById('price-slider-display');
  const inStockCheckbox = document.getElementById('filter-in-stock');
  const sortSelect = document.getElementById('catalog-sort-select');
  const resetBtn = document.getElementById('filter-reset-btn');
  const genderTabs = document.querySelectorAll('.gender-tab-btn');

  // Render Category Quick Chips
  if (categoryChipsContainer) {
    categoryChipsContainer.innerHTML = CATEGORIES.map(cat => `
      <button type="button" class="cat-chip ${store.filters.category === cat.id ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.label}</span>
      </button>
    `).join('');

    categoryChipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.cat-chip');
      if (!chip) return;
      const catId = chip.dataset.category;
      store.setFilter('category', catId);
    });
  }

  // Render Size Filter Pills
  if (sizePillsContainer) {
    sizePillsContainer.innerHTML = SIZES.map(size => `
      <button type="button" class="size-pill-btn ${store.filters.size === size ? 'active' : ''}" data-size="${size}">
        ${size}
      </button>
    `).join('');

    sizePillsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.size-pill-btn');
      if (!btn) return;
      const sizeVal = btn.dataset.size;
      // Toggle if already selected
      const newSize = store.filters.size === sizeVal ? null : sizeVal;
      store.setFilter('size', newSize);
    });
  }

  // Gender Filter Tabs
  genderTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const gender = tab.dataset.gender;
      store.setFilter('gender', gender);
    });
  });

  // Price Slider
  if (priceSlider && priceDisplay) {
    priceSlider.value = store.filters.maxPrice;
    priceDisplay.textContent = formatCurrency(store.filters.maxPrice);

    priceSlider.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      priceDisplay.textContent = formatCurrency(val);
      store.setFilter('maxPrice', val);
    });
  }

  // In-Stock Toggle
  if (inStockCheckbox) {
    inStockCheckbox.checked = store.filters.inStockOnly;
    inStockCheckbox.addEventListener('change', (e) => {
      store.setFilter('inStockOnly', e.target.checked);
    });
  }

  // Sort Dropdown
  if (sortSelect) {
    sortSelect.value = store.filters.sort;
    sortSelect.addEventListener('change', (e) => {
      store.setFilter('sort', e.target.value);
    });
  }

  // Reset Filters Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      store.resetFilters();
    });
  }

  // Sync active states on filter changes
  store.subscribe((eventType, payload) => {
    if (eventType === 'filters_changed') {
      const { filters } = payload;

      // Update category chips active class
      document.querySelectorAll('.cat-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.category === filters.category);
      });

      // Update size pills active class
      document.querySelectorAll('.size-pill-btn').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.size === filters.size);
      });

      // Update gender tabs active class
      document.querySelectorAll('.gender-tab-btn').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.gender === filters.gender);
      });

      // Update price slider
      if (priceSlider && priceDisplay) {
        priceSlider.value = filters.maxPrice;
        priceDisplay.textContent = formatCurrency(filters.maxPrice);
      }

      // Update in-stock checkbox
      if (inStockCheckbox) {
        inStockCheckbox.checked = filters.inStockOnly;
      }

      // Update sort select
      if (sortSelect) {
        sortSelect.value = filters.sort;
      }
    }
  });
}
