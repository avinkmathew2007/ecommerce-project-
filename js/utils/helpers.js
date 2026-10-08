/**
 * VÉLANE ATELIER - Utility Functions
 */

export function formatCurrency(amount, currency = 'INR') {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

export function debounce(fn, delay = 250) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(`velane_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(`velane_${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
}

export function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  let html = '';

  for (let i = 0; i < full; i++) {
    html += `<span class="star star-full" aria-hidden="true">★</span>`;
  }
  if (half) {
    html += `<span class="star star-half" aria-hidden="true">★</span>`;
  }
  for (let i = 0; i < empty; i++) {
    html += `<span class="star star-empty" aria-hidden="true">☆</span>`;
  }
  return html;
}
