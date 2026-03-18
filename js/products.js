import { state } from './state.js';
import { formatPrice } from './utils.js';

export function renderProducts() {
    const grid = document.getElementById('productGrid');
    
    if (state.filteredProducts.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-500">No products found for your criteria.</div>';
        return;
    }
    
    grid.innerHTML = state.filteredProducts.map(product => `
        <article class="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 flex flex-col">
            <div class="relative h-64 mb-6 cursor-pointer overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-950 flex items-center justify-center" onclick="showProductModal('${product.id}')">
                <img src="${product.image}" alt="${product.name}" class="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div class="flex flex-col flex-1">
                <h3 class="text-xl font-black mb-1 dark:text-white">${product.name}</h3>
                <p class="text-xs font-bold text-purple-600 dark:text-purple-400 mb-3 uppercase tracking-widest">${product.highlight}</p>
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span class="text-2xl font-black grad-text">${formatPrice(product.price)}</span>
                    <button onclick="addToCart('${product.id}')" class="p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-2xl hover:scale-105 transition-transform">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

export function handleSearchAndFilter() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const priceRange = document.getElementById('priceFilter').value;
    
    state.filteredProducts = state.products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(query) || p.highlight.toLowerCase().includes(query);
        let matchesPrice = true;
        if (priceRange === 'under-1000') matchesPrice = p.price < 1000;
        if (priceRange === 'over-1000') matchesPrice = p.price >= 1000;
        return matchesSearch && matchesPrice;
    });
    
    renderProducts();
}
