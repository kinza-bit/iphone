/**
 * iPhone 16 E-commerce App Logic
 * Features: Dynamic loading, cart system, modals, checkout, and search/filter.
 */

// --- DATA ---
const embeddedProducts = [
  {
    "id": "iphone-16",
    "name": "iPhone 16",
    "price": 799,
    "highlight": "The future is in your hand.",
    "description": "Powered by the all-new A18 Bionic chip, reengineered camera system, and an all-day battery that keeps up with your ambitions.",
    "image": "iPhone_16_Pink_PDP_Image_Position_1__en-WW.webp",
    "colors": [
      { "name": "Pink", "hex": "#f8bbd0" },
      { "name": "Black", "hex": "#212121" },
      { "name": "White", "hex": "#ffffff" },
      { "name": "Ultramarine", "hex": "#000080" },
      { "name": "Teal", "hex": "#008080" }
    ],
    "storage": ["128GB", "256GB", "512GB"],
    "specs": {
      "display": "6.1″ Super Retina XDR",
      "chip": "A18 Bionic",
      "camera": "48MP Main + 12MP Ultra Wide",
      "battery": "Up to 22 hours video playback"
    },
    "features": ["Action Button", "Dynamic Island", "Apple Intelligence", "Ceramic Shield", "Aerospace-grade aluminium"]
  },
  {
    "id": "iphone-16-pro",
    "name": "iPhone 16 Pro",
    "price": 999,
    "highlight": "Hello, Apple Intelligence.",
    "description": "A total pro. The A18 Pro chip makes Pro possible. Incredible power efficiency. Pro motion display.",
    "image": "iPhone-16-Pro-Desert-Titanium-1.webp",
    "colors": [
      { "name": "Desert Titanium", "hex": "#c5b358" },
      { "name": "Natural Titanium", "hex": "#d3d3d3" },
      { "name": "White Titanium", "hex": "#f5f5f5" },
      { "name": "Black Titanium", "hex": "#2e2e2e" }
    ],
    "storage": ["128GB", "256GB", "512GB", "1TB"],
    "specs": {
      "display": "6.3″ Super Retina XDR",
      "chip": "A18 Pro",
      "camera": "48MP Main + 48MP Ultra Wide + 12MP Telephoto",
      "battery": "Up to 27 hours video playback"
    },
    "features": ["ProMotion (120Hz)", "Always-On display", "Action Button", "Camera Control", "Grade 5 titanium design"]
  },
  {
    "id": "iphone-16-pro-max",
    "name": "iPhone 16 Pro Max",
    "price": 1199,
    "highlight": "The ultimate iPhone.",
    "description": "The largest display ever on an iPhone. The best battery life ever. The most advanced camera system.",
    "image": "Apple-iPhone-16-Pro-Max-Qmart-4-removebg-preview.png",
    "colors": [
      { "name": "Desert Titanium", "hex": "#c5b358" },
      { "name": "Natural Titanium", "hex": "#d3d3d3" },
      { "name": "White Titanium", "hex": "#f5f5f5" },
      { "name": "Black Titanium", "hex": "#2e2e2e" }
    ],
    "storage": ["256GB", "512GB", "1TB"],
    "specs": {
      "display": "6.9″ Super Retina XDR",
      "chip": "A18 Pro",
      "camera": "48MP Main + 48MP Ultra Wide + 12MP Telephoto",
      "battery": "Up to 33 hours video playback"
    },
    "features": ["Largest display ever", "Longest battery life", "Pro camera system", "A18 Pro chip", "Camera Control"]
  }
];

// --- STATE MANAGEMENT ---
let products = [];
let cart = [];
let filteredProducts = [];

// --- INITIALIZATION ---
async function init() {
    try {
        // Using embedded data to avoid CORS issues on local filesystem
        products = [...embeddedProducts];
        filteredProducts = [...products];
        
        setupEventListeners();
        renderProducts();
        updateCartUI();
        
    } catch (error) {
        console.error('Error loading product data:', error);
        document.getElementById('productGrid').innerHTML = `
            <div class="col-span-full text-center py-20">
                <p class="text-red-500 font-bold">Failed to load products. Please try again later.</p>
            </div>
        `;
    }
}

function setupEventListeners() {
    // Cart drawer toggles
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);
    
    // Search and Filter
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearchAndFilter, 300));
    document.getElementById('priceFilter').addEventListener('change', handleSearchAndFilter);
    
    // Checkout toggle
    document.getElementById('checkoutBtn').addEventListener('click', openCheckoutModal);

    // Mobile Menu Toggle
    document.getElementById('menuToggle').addEventListener('click', toggleMenu);
}

// --- UTILS ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
}

// --- UI ACTIONS: CART ---
function toggleCart() {
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

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    showToast(`Added ${product.name} to cart!`);
    updateCartUI();
    
    // If modal is open, maybe close it or just show feedback
}

function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Update count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }
    
    // Update total price
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(totalPrice);
    
    // Enable/Disable checkout
    checkoutBtn.disabled = cart.length === 0;
    
    // Render items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500 mt-10">Your cart is empty.</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
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

// --- UI ACTIONS: PRODUCTS ---
function renderProducts() {
    const grid = document.getElementById('productGrid');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-500">No products found for your criteria.</div>';
        return;
    }
    
    grid.innerHTML = filteredProducts.map(product => `
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

function handleSearchAndFilter() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const priceRange = document.getElementById('priceFilter').value;
    
    filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(query) || p.highlight.toLowerCase().includes(query);
        let matchesPrice = true;
        if (priceRange === 'under-1000') matchesPrice = p.price < 1000;
        if (priceRange === 'over-1000') matchesPrice = p.price >= 1000;
        return matchesSearch && matchesPrice;
    });
    
    renderProducts();
}

// --- UI ACTIONS: MODALS ---
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const content = document.getElementById('productModalContent');
    const modal = document.getElementById('productModal');
    
    content.innerHTML = `
        <div class="bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-8 lg:p-12 h-64 lg:h-auto">
            <img src="${product.image}" alt="${product.name}" class="max-h-full max-w-full object-contain">
        </div>
        <div class="p-8 lg:p-12 flex flex-col">
            <div class="mb-8">
                <h3 class="text-3xl font-black mb-2 dark:text-white">${product.name}</h3>
                <p class="text-4xl font-black grad-text mb-4">${formatPrice(product.price)}</p>
                <p class="text-gray-500 dark:text-gray-400 leading-relaxed">${product.description}</p>
            </div>
            
            <!-- Tabs (Simplified) -->
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
        </div>
    `;
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const summary = document.getElementById('orderSummary');
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    summary.innerHTML = `
        <div class="space-y-2 mb-4">
            ${cart.map(item => `
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
    toggleCart(); // Close cart drawer
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
}

function handleCheckout(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = Object.fromEntries(formData);
    
    // Simulate API call
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showToast(`Thank you, ${orderData.name}! Your order has been placed.`, 'success');
        cart = []; // Empty cart
        updateCartUI();
        closeCheckoutModal();
        
        // Show success state on page maybe?
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

// --- UTILS: TOAST ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl transition-all duration-300 translate-y-10 opacity-0 pointer-events-auto max-w-sm`;
    
    const icon = type === 'success' ? '✅' : 'ℹ️';
    
    toast.innerHTML = `
        <span class="text-xl">${icon}</span>
        <p class="text-sm font-bold dark:text-gray-200">${message}</p>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    });
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.add('translate-y-[-10px]', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- UI ACTIONS: MOBILE MENU ---
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.getElementById('menuToggle');
    const isOpen = !menu.classList.contains('translate-x-full');
    
    if (!isOpen) {
        menu.classList.remove('translate-x-full');
        toggle.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.add('translate-x-full');
        toggle.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    const icon = document.getElementById('mobileThemeIcon');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
}

// Start the app
init();
