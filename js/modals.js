import { state } from './state.js';
import { formatPrice, showToast } from './utils.js';
import { updateCartUI, toggleCart } from './cart.js';

export function showProductModal(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    const content = document.getElementById('productModalContent');
    const modal = document.getElementById('productModal');
    
    content.innerHTML = `<div class="bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8 lg:p-12 h-64 lg:h-auto">
            <img src="${product.image}" alt="${product.name}" class="max-h-full max-w-full object-contain">
        </div>
        <div class="p-8 lg:p-12 flex flex-col">
            <div class="mb-8">
                <h3 class="text-3xl font-black mb-2 dark:text-white">${product.name}</h3>
                <p class="text-4xl font-black grad-text mb-4">${formatPrice(product.price)}</p>
                <p class="text-gray-500 dark:text-gray-400 leading-relaxed">${product.description}</p>
            </div>
            
            <div class="space-y-6">
                <div>
                    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Key Specs</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                            <p class="text-[10px] text-gray-400 uppercase mb-1">Display</p>
                            <p class="text-sm font-bold dark:text-gray-200">${product.specs.display}</p>
                        </div>
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                            <p class="text-[10px] text-gray-400 uppercase mb-1">Chip</p>
                            <p class="text-sm font-bold dark:text-gray-200">${product.specs.chip}</p>
                        </div>
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                            <p class="text-[10px] text-gray-400 uppercase mb-1">Camera</p>
                            <p class="text-sm font-bold dark:text-gray-200">${product.specs.camera}</p>
                        </div>
                        <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                            <p class="text-[10px] text-gray-400 uppercase mb-1">Battery</p>
                            <p class="text-sm font-bold dark:text-gray-200">${product.specs.battery}</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Top Features</h4>
                    <ul class="flex flex-wrap gap-2">
                        ${product.features.map(f => `<li class="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-bold rounded-full">${f}</li>`).join('')}
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Available Colors</h4>
                    <div class="flex gap-3">
                        ${product.colors.map(c => `
                            <div class="w-8 h-8 rounded-full border-2 border-gray-100 dark:border-gray-800 cursor-pointer hover:scale-110 transition-transform shadow-inner" style="background-color: ${c.hex}" title="${c.name}"></div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="mt-auto pt-8">
                <button onclick="addToCart('${product.id}'); closeProductModal();" class="w-full grad-btn text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-500/20 hover:opacity-90 transition-all">
                    Add to Cart
                </button>
            </div>
        </div>`;
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
}

export function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
}

export function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const summary = document.getElementById('orderSummary');
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    summary.innerHTML = `
        <div class="space-y-2 mb-4">
            ${state.cart.map(item => `
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">${item.name} x${item.quantity}</span>
                    <span class="font-bold dark:text-gray-200">${formatPrice(item.price * item.quantity)}</span>
                </div>
            `).join('')}
        </div>
        <div class="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold text-lg dark:text-white">
            <span>Total</span>
            <span>${formatPrice(totalPrice)}</span>
        </div>
    `;
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
    toggleCart(); 
}

export function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
}

export function handleCheckout(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = Object.fromEntries(formData);
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showToast(`Thank you, ${orderData.name}! Your order has been placed.`, 'success');
        state.cart = [];
        updateCartUI();
        closeCheckoutModal();
        
        const heroSection = document.getElementById('hero');
        heroSection.innerHTML = `
            <div class="text-center py-20 animate-fade-in px-6">
                <div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                    <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 class="text-5xl font-black mb-4 dark:text-white">Order Confirmed!</h1>
                <p class="text-xl text-gray-500 mb-8 max-w-lg mx-auto">Check your email for details. Your iPhone 16 will be with you shortly.</p>
                <button onclick="window.location.reload()" class="grad-btn text-white px-8 py-4 rounded-full font-bold shadow-xl">Back to Store</button>
            </div>
        `;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
}
