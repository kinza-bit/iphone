import { state } from './state.js';
import { formatPrice, showToast } from './utils.js';

export function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const isOpening = drawer.classList.contains('translate-x-full');
    
    if (isOpening) {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
    } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    }
}

export function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = state.cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }
    
    showToast(`Added ${product.name} to cart!`);
    updateCartUI();
}

export function updateQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        state.cart = state.cart.filter(i => i.id !== productId);
    }
    
    updateCartUI();
}

export function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }
    
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(totalPrice);
    
    checkoutBtn.disabled = state.cart.length === 0;
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500 mt-10">Your cart is empty.</p>';
    } else {
        cartItems.innerHTML = state.cart.map(item => `
            <div class="flex items-center gap-4 group">
                <div class="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden flex-shrink-0">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain">
                </div>
                <div class="flex-1">
                    <h4 class="text-sm font-bold dark:text-white">${item.name}</h4>
                    <p class="text-xs text-gray-500">${formatPrice(item.price)}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateQuantity('${item.id}', -1)" class="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">-</button>
                    <span class="text-sm font-medium w-4 text-center dark:text-gray-300">${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">+</button>
                </div>
            </div>
        `).join('');
    }
}
