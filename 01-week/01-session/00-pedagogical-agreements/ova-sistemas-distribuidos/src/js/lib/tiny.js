/* =========================================================
   Tiny Helpers Library (offline, no external dependencies)
   OVA · Estructura de Datos · CORHUILA
   ========================================================= */

(function () {
  "use strict";

  /**
   * Query selector shorthand
   * @param {string} selector - CSS selector
   * @param {Element} context - Parent element (default: document)
   * @returns {Element|null}
   */
  const qs = (selector, context = document) => context.querySelector(selector);

  /**
   * Query selector all shorthand (returns array)
   * @param {string} selector - CSS selector
   * @param {Element} context - Parent element (default: document)
   * @returns {Element[]}
   */
  const qsa = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  /**
   * Add event listener shorthand
   * @param {Element} element - Target element
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  const on = (element, event, handler, options) => {
    if (element) {
      element.addEventListener(event, handler, options);
    }
  };

  /**
   * Remove event listener shorthand
   * @param {Element} element - Target element
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  const off = (element, event, handler) => {
    if (element) {
      element.removeEventListener(event, handler);
    }
  };

  /**
   * Clamp a number between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number}
   */
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string}
   */
  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  /**
   * Debounce function execution
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function}
   */
  const debounce = (fn, delay = 150) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  /**
   * Throttle function execution
   * @param {Function} fn - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function}
   */
  const throttle = (fn, limit = 100) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  /**
   * Local storage wrapper with error handling
   */
  const storage = {
    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} fallback - Fallback value if key doesn't exist
     * @returns {*}
     */
    get(key, fallback = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (error) {
        console.warn(`[Storage] Error reading key "${key}":`, error);
        return fallback;
      }
    },

    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} - Success status
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.warn(`[Storage] Error writing key "${key}":`, error);
        return false;
      }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.warn(`[Storage] Error removing key "${key}":`, error);
        return false;
      }
    },

    /**
     * Clear all items from localStorage
     * @returns {boolean} - Success status
     */
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.warn('[Storage] Error clearing storage:', error);
        return false;
      }
    }
  };

  /**
   * Generate a simple unique ID
   * @param {string} prefix - ID prefix
   * @returns {string}
   */
  const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;

  /**
   * Check if an element is in viewport
   * @param {Element} element - Element to check
   * @param {number} threshold - Visibility threshold (0-1)
   * @returns {boolean}
   */
  const isInViewport = (element, threshold = 0) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight * (1 - threshold)) && ((rect.top + rect.height) >= windowHeight * threshold);
    const horInView = (rect.left <= windowWidth * (1 - threshold)) && ((rect.left + rect.width) >= windowWidth * threshold);
    
    return vertInView && horInView;
  };

  /**
   * Announce message to screen readers
   * @param {string} message - Message to announce
   * @param {string} priority - 'polite' or 'assertive'
   */
  const announce = (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  /**
   * Format a number as percentage
   * @param {number} value - Value (0-1 or 0-100)
   * @param {boolean} isDecimal - Is the value a decimal (0-1)?
   * @returns {string}
   */
  const formatPercent = (value, isDecimal = false) => {
    const percent = isDecimal ? value * 100 : value;
    return `${Math.round(percent)}%`;
  };

  // Export to global scope
  window.tiny = {
    qs,
    qsa,
    on,
    off,
    clamp,
    escapeHtml,
    debounce,
    throttle,
    storage,
    uid,
    isInViewport,
    announce,
    formatPercent
  };

})();
