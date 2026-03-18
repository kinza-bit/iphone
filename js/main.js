import { debounce } from './utils.js';
import { toggleCart, addToCart, updateQuantity, updateCartUI } from './cart.js';
import { renderProducts, handleSearchAndFilter } from './products.js';
import { 
    showProductModal, closeProductModal, 
    openCheckoutModal, closeCheckoutModal, 
    handleCheckout 
} from './modals.js';
import { toggleMenu, toggleDarkMode } from './menu.js';

// Initialization
function init() {
    setupEventListeners();
    renderProducts();
    updateCartUI();
}

function setupEventListeners() {
    // Add event listeners for elements that exist in the DOM on load
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    
    const closeCart = document.getElementById('closeCart');
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', debounce(handleSearchAndFilter, 300));
    
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) priceFilter.addEventListener('change', handleSearchAndFilter);
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);
    
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
}

// Global exports for inline HTML handlers
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.showProductModal = showProductModal;
window.closeProductModal = closeProductModal;
window.toggleCart = toggleCart;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.handleCheckout = handleCheckout;
window.toggleMenu = toggleMenu;
window.toggleDarkMode = toggleDarkMode;

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
