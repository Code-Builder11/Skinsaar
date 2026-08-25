/**
 * SKINSAAR STATIC DEMO — Interactive Client App JS
 * Features:
 * - Mobile Menu & Cart Drawer slide-over
 * - Dynamic client-side Shopping Bag (Add/Remove/Quantity, persistent in localStorage)
 * - Coupon Engine (WELCOME10, SKINSAAR20, FLAT150)
 * - Free Shipping progress indicator (Threshold: ₹699)
 * - Product detail thumbnail switcher & tab accordions
 * - Client-side category filtering & live search
 * - Pincode lookup simulator
 */

// Sample Catalog DB for Client-side Cart
const CATALOG = {
    1: { id: 1, name: 'Golden Wash', subtitle: 'Turmeric, Rice & Vitamin C Facewash', volume: '100ml', price: 449, comparePrice: 599, image: 'images/products/golden-wash-1.webp', slug: 'product-detail.html' },
    2: { id: 2, name: 'Glow Drops', subtitle: '15% Vitamin C & Ferulic Acid Serum', volume: '30ml', price: 699, comparePrice: 899, image: 'images/products/glow-drops-1.webp', slug: 'product-detail.html' },
    3: { id: 3, name: 'Youth Repair', subtitle: '0.3% Retinol & 5-Ceramide Night Cream', volume: '50g', price: 799, comparePrice: 999, image: 'images/products/youth-repair-1.webp', slug: 'product-detail.html' },
    4: { id: 4, name: 'Sun Shield', subtitle: 'SPF 50 PA++++ Sunscreen with Niacinamide', volume: '50ml', price: 549, comparePrice: 699, image: 'images/products/sun-shield-1.webp', slug: 'product-detail.html' }
};

// Initial state
let cart = JSON.parse(localStorage.getItem('skinsaar_demo_cart')) || {
    items: [
        { id: 2, quantity: 1 } // Pre-load 1 Glow Drops for immediate visual pop
    ],
    coupon: null
};

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCartDrawer();
    initThumbnailSwitcher();
    initAddToCartListeners();
    initCouponSystem();
    initCategoryFilter();
    initPincodeLookup();
    renderCart();
});

function saveCart() {
    localStorage.setItem('skinsaar_demo_cart', JSON.stringify(cart));
    renderCart();
}

// 1. Mobile Menu
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

// 2. Slide-Over Cart Drawer
function initCartDrawer() {
    const triggerBtn = document.getElementById('cart-drawer-btn');
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    const panel = document.getElementById('cart-panel');
    const closeBtn = document.getElementById('cart-close-btn');

    if (!drawer || !panel) return;

    function openCart() {
        renderCart();
        drawer.classList.remove('pointer-events-none', 'opacity-0');
        drawer.classList.add('opacity-100');
        panel.classList.remove('translate-x-full');
        panel.classList.add('translate-x-0');
    }

    function closeCart() {
        panel.classList.remove('translate-x-0');
        panel.classList.add('translate-x-full');
        drawer.classList.remove('opacity-100');
        drawer.classList.add('opacity-0', 'pointer-events-none');
    }

    if (triggerBtn) triggerBtn.addEventListener('click', openCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (backdrop) backdrop.addEventListener('click', closeCart);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });

    window.openSkinsaarCart = openCart;
    window.closeSkinsaarCart = closeCart;
}

// 3. Add to Cart Handlers
function initAddToCartListeners() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-add-to-cart]');
        if (!btn) return;
        e.preventDefault();

        const productId = parseInt(btn.getAttribute('data-add-to-cart'), 10);
        const qtyInput = document.getElementById('pdp-qty');
        const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

        addToCart(productId, quantity);

        // Visual feedback
        const origText = btn.innerHTML;
        btn.innerHTML = '<span class="animate-pulse">✓ Added!</span>';
        setTimeout(() => {
            btn.innerHTML = origText;
            window.openSkinsaarCart();
        }, 300);
    });

    document.addEventListener('submit', (e) => {
        const form = e.target.closest('.add-to-cart-form');
        if (!form) return;
        e.preventDefault();

        const idInput = form.querySelector('input[name="product_id"]');
        const qtyInput = form.querySelector('input[name="quantity"]') || document.getElementById('pdp-qty');
        const productId = idInput ? parseInt(idInput.value, 10) : 2;
        const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

        addToCart(productId, quantity);
        window.openSkinsaarCart();
    });
}

function addToCart(productId, quantity = 1) {
    const existing = cart.items.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.items.push({ id: productId, quantity: quantity });
    }
    saveCart();
}

window.updateCartQty = function(productId, newQty) {
    if (newQty <= 0) {
        window.removeCartItem(productId);
        return;
    }
    const item = cart.items.find(i => i.id === productId);
    if (item) {
        item.quantity = newQty;
        saveCart();
    }
};

window.removeCartItem = function(productId) {
    cart.items = cart.items.filter(i => i.id !== productId);
    saveCart();
};

// 4. Cart Rendering
function renderCart() {
    const itemsList = document.getElementById('drawer-items-list');
    const badge = document.getElementById('cart-badge-count');
    const drawerCount = document.getElementById('drawer-item-count');
    const drawerFooter = document.getElementById('drawer-footer');

    // Calculate totals
    let totalQty = 0;
    let subtotal = 0;

    cart.items.forEach(item => {
        const product = CATALOG[item.id];
        if (product) {
            totalQty += item.quantity;
            subtotal += product.price * item.quantity;
        }
    });

    // Update Badge
    if (badge) {
        badge.innerText = totalQty;
        if (totalQty > 0) badge.classList.remove('hidden');
        else badge.classList.add('hidden');
    }
    if (drawerCount) {
        drawerCount.innerText = `${totalQty} item${totalQty === 1 ? '' : 's'}`;
    }

    // Free Shipping Progress
    const freeThreshold = 699;
    const freeText = document.getElementById('free-shipping-text');
    const freeBar = document.getElementById('free-shipping-bar');
    if (freeText && freeBar) {
        if (subtotal >= freeThreshold || totalQty === 0) {
            if (subtotal >= freeThreshold) {
                freeText.innerText = '🎉 You unlocked Free Express Delivery across India!';
                freeBar.style.width = '100%';
            } else {
                freeText.innerText = 'Add ₹699 for Free Delivery across India';
                freeBar.style.width = '0%';
            }
        } else {
            const diff = (freeThreshold - subtotal).toFixed(2);
            const pct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
            freeText.innerText = `Add ₹${diff} more for Free Delivery across India`;
            freeBar.style.width = `${pct}%`;
        }
    }

    // Empty state
    if (cart.items.length === 0) {
        if (itemsList) {
            itemsList.innerHTML = `
                <div class="text-center py-12 text-[#8E8E93]">
                    <svg class="w-12 h-12 mx-auto mb-3 text-[#C7BCA8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    <p class="font-serif text-lg text-[#1C3B2E] mb-1">Your bag is empty</p>
                    <p class="text-xs text-[#8E8E93] mb-4">Discover our potent botanical formulations.</p>
                    <a href="products.html" class="inline-block px-5 py-2 rounded-full bg-[#1C3B2E] text-[#D8B76E] text-xs font-semibold hover:bg-[#142C22] transition-colors">Explore Formulations</a>
                </div>
            `;
        }
        if (drawerFooter) drawerFooter.classList.add('hidden');
        return;
    }

    if (drawerFooter) drawerFooter.classList.remove('hidden');

    // Render Drawer Items
    if (itemsList) {
        let html = '';
        cart.items.forEach(item => {
            const prod = CATALOG[item.id];
            if (!prod) return;
            html += `
                <div class="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-[#E4DCD0] shadow-sm">
                    <img src="${prod.image}" alt="${prod.name}" class="w-14 h-14 object-contain bg-[#FCFAF7] rounded-xl p-1 border border-[#E4DCD0]">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-serif font-bold text-xs text-[#142C22] truncate">${prod.name}</h4>
                        <span class="text-[10px] text-[#8E8E93] block">${prod.volume}</span>
                        <span class="text-xs font-bold text-[#142C22] mt-0.5 block">₹${prod.price.toFixed(2)}</span>
                    </div>
                    <div class="flex flex-col items-end space-y-1">
                        <div class="flex items-center border border-[#D8CEBC] rounded-full bg-[#FAF5E9] px-2 py-0.5 text-xs">
                            <button onclick="updateCartQty(${prod.id}, ${item.quantity - 1})" class="px-1 text-[#636366] font-bold hover:text-[#142C22]">-</button>
                            <span class="px-1.5 font-bold text-[#142C22] text-[11px]">${item.quantity}</span>
                            <button onclick="updateCartQty(${prod.id}, ${item.quantity + 1})" class="px-1 text-[#636366] font-bold hover:text-[#142C22]">+</button>
                        </div>
                        <button onclick="removeCartItem(${prod.id})" class="text-[10px] text-red-500 hover:underline">Remove</button>
                    </div>
                </div>
            `;
        });
        itemsList.innerHTML = html;
    }

    // Calculate Discount
    let discountAmount = 0;
    if (cart.coupon) {
        if (cart.coupon.type === 'percentage') {
            discountAmount = (subtotal * cart.coupon.value) / 100;
        } else if (cart.coupon.type === 'fixed') {
            discountAmount = Math.min(subtotal, cart.coupon.value);
        }
    }

    const shippingFee = (subtotal >= freeThreshold || subtotal === 0) ? 0 : 50;
    const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

    // Update Drawer Price Nodes
    const subtotalEl = document.getElementById('drawer-subtotal');
    const totalEl = document.getElementById('drawer-total');
    const shippingEl = document.getElementById('drawer-shipping');
    const discountRow = document.getElementById('drawer-discount-row');
    const discountVal = document.getElementById('drawer-discount');
    const couponApplied = document.getElementById('drawer-coupon-applied');
    const couponName = document.getElementById('drawer-coupon-name');

    if (subtotalEl) subtotalEl.innerText = `₹${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.innerText = shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `₹${finalTotal.toFixed(2)}`;

    if (discountAmount > 0 && cart.coupon) {
        if (discountRow) {
            discountRow.classList.remove('hidden');
            discountVal.innerText = `-₹${discountAmount.toFixed(2)}`;
        }
        if (couponApplied && couponName) {
            couponApplied.classList.remove('hidden');
            couponName.innerText = `Code '${cart.coupon.code}' applied (${cart.coupon.label})`;
        }
    } else {
        if (discountRow) discountRow.classList.add('hidden');
        if (couponApplied) couponApplied.classList.add('hidden');
    }
}

// 5. Coupon System
function initCouponSystem() {
    const couponForm = document.getElementById('drawer-coupon-form');
    const removeBtn = document.getElementById('drawer-remove-coupon');

    const VALID_COUPONS = {
        'WELCOME10': { code: 'WELCOME10', type: 'percentage', value: 10, label: '10% OFF Welcome Bonus' },
        'SKINSAAR20': { code: 'SKINSAAR20', type: 'percentage', value: 20, label: '20% OFF Special Patron' },
        'FLAT150': { code: 'FLAT150', type: 'fixed', value: 150, label: '₹150 OFF Flat Discount' }
    };

    if (couponForm) {
        couponForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('drawer-coupon-code');
            const code = input ? input.value.trim().toUpperCase() : '';

            if (VALID_COUPONS[code]) {
                cart.coupon = VALID_COUPONS[code];
                saveCart();
                input.value = '';
            } else {
                alert('Invalid promo code. Try: WELCOME10, SKINSAAR20, or FLAT150');
            }
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            cart.coupon = null;
            saveCart();
        });
    }
}

// 6. Thumbnail Switcher
function initThumbnailSwitcher() {
    const thumbs = document.querySelectorAll('.thumb-btn');
    const mainImg = document.getElementById('main-product-image');
    if (!mainImg || thumbs.length === 0) return;

    thumbs.forEach(btn => {
        btn.addEventListener('click', () => {
            const src = btn.getAttribute('data-src');
            if (src) {
                mainImg.src = src;
                thumbs.forEach(t => t.classList.remove('border-[#C9A455]', 'ring-2', 'ring-[#C9A455]/50'));
                btn.classList.add('border-[#C9A455]', 'ring-2', 'ring-[#C9A455]/50');
            }
        });
    });
}

// 7. Interactive Category Filter & Live Search (For Catalog)
function initCategoryFilter() {
    const pills = document.querySelectorAll('[data-filter-category]');
    const cards = document.querySelectorAll('[data-product-category]');
    const searchInput = document.getElementById('catalog-search-input');
    const sortSelect = document.getElementById('catalog-sort-select');

    if (pills.length === 0 && !searchInput) return;

    let activeCategory = 'all';
    let searchQuery = '';

    function filterGrid() {
        cards.forEach(card => {
            const cat = card.getAttribute('data-product-category');
            const name = (card.getAttribute('data-product-name') || '').toLowerCase();
            const matchCat = (activeCategory === 'all' || cat === activeCategory);
            const matchSearch = (!searchQuery || name.includes(searchQuery.toLowerCase()));

            if (matchCat && matchSearch) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
            activeCategory = pill.getAttribute('data-filter-category');

            pills.forEach(p => {
                p.classList.remove('bg-[#1C3B2E]', 'text-[#D8B76E]', 'shadow-sm');
                p.classList.add('bg-white', 'text-[#1C3B2E]', 'border', 'border-[#E4DCD0]');
            });

            pill.classList.remove('bg-white', 'text-[#1C3B2E]', 'border', 'border-[#E4DCD0]');
            pill.classList.add('bg-[#1C3B2E]', 'text-[#D8B76E]', 'shadow-sm');

            filterGrid();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            filterGrid();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            const grid = document.getElementById('catalog-products-grid');
            if (!grid) return;
            const items = Array.from(grid.children);
            const val = e.target.value;

            items.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-price') || 0);
                const priceB = parseFloat(b.getAttribute('data-price') || 0);
                const ratingA = parseFloat(a.getAttribute('data-rating') || 0);
                const ratingB = parseFloat(b.getAttribute('data-rating') || 0);

                if (val === 'price_low_high') return priceA - priceB;
                if (val === 'price_high_low') return priceB - priceA;
                if (val === 'rating') return ratingB - ratingA;
                return 0; // Default bestseller
            });

            items.forEach(item => grid.appendChild(item));
        });
    }
}

// 8. Pincode Lookup Simulator (India)
function initPincodeLookup() {
    const pinInput = document.getElementById('v_pincode');
    const cityInput = document.getElementById('v_city');
    const stateInput = document.getElementById('v_state');
    const spinner = document.getElementById('v-pincode-spinner');

    if (!pinInput) return;

    const PIN_DB = {
        '110001': { city: 'New Delhi', state: 'Delhi' },
        '400001': { city: 'Mumbai', state: 'Maharashtra' },
        '400050': { city: 'Mumbai', state: 'Maharashtra' },
        '560001': { city: 'Bengaluru', state: 'Karnataka' },
        '560102': { city: 'Bengaluru', state: 'Karnataka' },
        '600001': { city: 'Chennai', state: 'Tamil Nadu' },
        '700001': { city: 'Kolkata', state: 'West Bengal' },
        '500033': { city: 'Hyderabad', state: 'Telangana' },
        '226001': { city: 'Lucknow', state: 'Uttar Pradesh' },
        '208001': { city: 'Kanpur', state: 'Uttar Pradesh' }
    };

    pinInput.addEventListener('input', () => {
        const pin = pinInput.value.trim();
        if (pin.length === 6) {
            if (spinner) spinner.classList.remove('hidden');
            setTimeout(() => {
                if (spinner) spinner.classList.add('hidden');
                if (PIN_DB[pin]) {
                    if (cityInput) cityInput.value = PIN_DB[pin].city;
                    if (stateInput) stateInput.value = PIN_DB[pin].state;
                }
            }, 300);
        }
    });
}
