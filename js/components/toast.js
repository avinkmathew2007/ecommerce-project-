/**
 * VÉLANE ATELIER - Toast Notification Component
 */

let container = null;

function ensureToastContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(message, type = 'info', duration = 3500) {
  const toastBox = ensureToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: '✦'
  };

  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${iconMap[type] || '✦'}</span>
    <span class="toast-msg">${message}</span>
    <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
  `;

  toastBox.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => {
      toast.remove();
    }, 250);
  }, duration);
}
