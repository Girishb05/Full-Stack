/* ─────────────────────────────────────────────────
   ShopEase — Frontend Application Logic
   ───────────────────────────────────────────────── */

const API = '';  // Same origin — leave blank

// ─── State ───
let currentUser = null;
let cartCount = 0;
let selectedProductIds = new Set(); // Track selected items for ordering
let isCartFirstLoad = true; // Flag to initialize selection on first load 

// ─── Init ───
document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    initNavbar();
    initPage();
});

// ─── Session ───
async function checkSession() {
    try {
        const resp = await fetch(`${API}/api/auth/session`);
        const data = await resp.json();
        if (data.loggedIn) {
            currentUser = data;
            updateNavAuth();
            loadCartCount();
        } else {
            updateNavAuth();
        }
    } catch (e) {
        console.log('Session check failed', e);
    }
}

function updateNavAuth() {
    const authLinks = document.getElementById('authLinks');
    if (!authLinks) return;

    if (currentUser) {
        authLinks.innerHTML = `
            <a href="orders.html">My Orders</a>
            <div class="nav-user" id="userDropdown">
                <span>👋 ${currentUser.name}</span>
            </div>
            <a href="#" onclick="logout(); return false;">Logout</a>
        `;
    } else {
        authLinks.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

async function loadCartCount() {
    try {
        const resp = await fetch(`${API}/api/cart/count`);
        if (resp.ok) {
            const data = await resp.json();
            cartCount = data.count;
            updateCartBadge();
        }
    } catch (e) { }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

// ─── Auth ───
async function login(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('formError');

    try {
        const resp = await fetch(`${API}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await resp.json();
        if (data.success) {
            showToast('Login successful! Welcome back 🎉', 'success');
            setTimeout(() => window.location.href = 'index.html', 800);
        } else {
            if (errorEl) { errorEl.textContent = data.error; errorEl.style.display = 'block'; }
            showToast(data.error, 'error');
        }
    } catch (e) {
        showToast('Network error. Please try again.', 'error');
    }
}

async function register(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone')?.value || '';
    const errorEl = document.getElementById('formError');

    try {
        const resp = await fetch(`${API}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone })
        });
        const data = await resp.json();
        if (data.success) {
            showToast('Registration successful! 🎉', 'success');
            setTimeout(() => window.location.href = 'login.html', 1000);
        } else {
            if (errorEl) { errorEl.textContent = data.error; errorEl.style.display = 'block'; }
            showToast(data.error, 'error');
        }
    } catch (e) {
        showToast('Network error. Please try again.', 'error');
    }
}

async function logout() {
    await fetch(`${API}/api/auth/logout`, { method: 'POST' });
    currentUser = null;
    window.location.href = 'index.html';
}

// ─── Products ───
async function loadFeaturedProducts() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    try {
        const resp = await fetch(`${API}/api/products/featured`);
        const products = await resp.json();
        grid.innerHTML = products.map(p => productCard(p)).join('');
    } catch (e) {
        grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Unable to load products</p>';
    }
}

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || document.getElementById('categoryFilter')?.value || '';
    const search = document.getElementById('searchInput')?.value || '';
    const sort = document.getElementById('sortSelect')?.value || '';

    grid.innerHTML = '<div class="spinner"></div>';

    try {
        const url = `${API}/api/products?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}&sort=${sort}`;
        const resp = await fetch(url);
        const products = await resp.json();
        if (products.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column:1/-1">
                    <div class="icon">🔍</div>
                    <h3>No products found</h3>
                    <p>Try a different search or category</p>
                </div>`;
        } else {
            grid.innerHTML = products.map(p => productCard(p)).join('');
        }
    } catch (e) {
        grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Unable to load products</p>';
    }
}

async function loadCategories() {
    const select = document.getElementById('categoryFilter');
    if (!select) return;
    try {
        const resp = await fetch(`${API}/api/products/categories`);
        const categories = await resp.json();
        categories.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            select.appendChild(opt);
        });
    } catch (e) { }
}

async function loadCategoriesGrid() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    try {
        const resp = await fetch(`${API}/api/products/categories`);
        const categories = await resp.json();
        grid.innerHTML = categories.map(c => `
            <a href="products.html?category=${encodeURIComponent(c.name)}" class="category-card">
                <img src="${c.imageUrl}" alt="${c.name}" loading="lazy">
                <div class="overlay">
                    <h3>${c.name}</h3>
                </div>
            </a>
        `).join('');
    } catch (e) { }
}

async function loadProductDetail() {
    const container = document.getElementById('productDetail');
    if (!container) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) { window.location.href = 'products.html'; return; }

    try {
        const resp = await fetch(`${API}/api/products/${id}`);
        const p = await resp.json();

        const stockClass = p.stock > 10 ? 'in-stock' : p.stock > 0 ? 'low-stock' : 'out-of-stock';
        const stockText = p.stock > 10 ? `In Stock (${p.stock} available)` : p.stock > 0 ? `Only ${p.stock} left!` : 'Out of Stock';

        container.innerHTML = `
            <div class="product-gallery">
                <img src="${p.imageUrl}" alt="${p.name}">
            </div>
            <div class="product-meta">
                <span class="category-label">${p.categoryName || ''}</span>
                <h1>${p.name}</h1>
                <div class="rating">
                    <span class="stars">${renderStars(p.rating)}</span>
                    <span style="font-weight:600">${p.rating}</span>
                    <span class="review-count">(${formatNumber(p.reviewCount)} reviews)</span>
                </div>
                <div class="price-block">
                    <span class="price">₹${formatPrice(p.price)}</span>
                    ${p.originalPrice ? `<span class="original-price">₹${formatPrice(p.originalPrice)}</span>` : ''}
                    ${p.discount > 0 ? `<span class="discount-tag">${p.discount}% OFF</span>` : ''}
                </div>
                <p class="description">${p.description}</p>
                <div class="stock-info ${stockClass}">
                    <span>${stockClass === 'in-stock' ? '✅' : stockClass === 'low-stock' ? '⚠️' : '❌'}</span>
                    <span>${stockText}</span>
                </div>
                <div class="add-to-cart-section">
                    <div class="quantity-control">
                        <button onclick="changeDetailQty(-1)">−</button>
                        <div class="qty-display" id="detailQty">1</div>
                        <button onclick="changeDetailQty(1)">+</button>
                    </div>
                    <button class="btn btn-primary btn-lg" onclick="addToCartFromDetail(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
                        🛒 Add to Cart
                    </button>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = '<div class="empty-state"><h3>Product not found</h3></div>';
    }
}

let detailQty = 1;
function changeDetailQty(delta) {
    detailQty = Math.max(1, detailQty + delta);
    const el = document.getElementById('detailQty');
    if (el) el.textContent = detailQty;
}

async function addToCartFromDetail(productId) {
    await addToCart(productId, detailQty);
}

// ─── Cart ───
async function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        showToast('Please login to add items to cart', 'info');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }
    try {
        const resp = await fetch(`${API}/api/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity })
        });
        const data = await resp.json();
        if (data.success) {
            cartCount = data.cartCount;
            updateCartBadge();
            showToast('Added to cart! 🛒', 'success');
        } else {
            showToast(data.error || 'Failed to add', 'error');
        }
    } catch (e) {
        showToast('Network error', 'error');
    }
}

async function loadCart() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    if (!container) return;

    if (!currentUser) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">🔒</div>
                <h3>Please login</h3>
                <p>You need to login to view your cart</p>
                <a href="login.html" class="btn btn-primary">Login</a>
            </div>`;
        if (summary) summary.style.display = 'none';
        return;
    }

    container.innerHTML = '<div class="spinner"></div>';

    try {
        const resp = await fetch(`${API}/api/cart`);
        const data = await resp.json();

        // Initialize selection only on first load of the cart
        if (isCartFirstLoad && data.items.length > 0) {
            data.items.forEach(item => selectedProductIds.add(item.productId));
            isCartFirstLoad = false;
        }

        if (data.items.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Start shopping to add items to your cart</p>
                    <a href="products.html" class="btn btn-primary">Browse Products</a>
                </div>`;
            if (summary) summary.style.display = 'none';
            return;
        }

        container.innerHTML = data.items.map(item => {
            const itemSubtotal = item.productPrice * item.quantity;
            return `
            <div class="cart-item fade-in">
                <input type="checkbox" class="item-checkbox" 
                    ${selectedProductIds.has(item.productId) ? 'checked' : ''} 
                    onchange="toggleItemSelection(${item.productId}, this.checked)">
                <img src="${item.productImage}" alt="${item.productName}">
                <div class="cart-item-details">
                    <h3>${item.productName}</h3>
                    <span class="item-price">₹${formatPrice(item.productPrice)}</span>
                    <div class="quantity-control">
                        <button onclick="updateCartQty(${item.productId}, ${item.quantity - 1})">−</button>
                        <div class="qty-display">${item.quantity}</div>
                        <button onclick="updateCartQty(${item.productId}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <span class="subtotal">₹${formatPrice(itemSubtotal)}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.productId})" title="Remove">🗑️</button>
                </div>
            </div>
        `;
        }).join('');

        // Show cart controls
        const controls = document.getElementById('cartControls');
        if (controls) {
            controls.style.display = 'block';
            document.getElementById('selectAll').checked = selectedProductIds.size === data.items.length;
        }

        if (summary) {
            summary.style.display = 'block';
            const selectedItems = data.items.filter(it => selectedProductIds.has(it.productId));
            const selectedTotal = selectedItems.reduce((acc, it) => acc + (it.productPrice * it.quantity), 0);
            const selectedCount = selectedItems.reduce((acc, it) => acc + it.quantity, 0);
            const tax = selectedTotal * 0.05;
            const shipping = (selectedTotal >= 500 || selectedTotal === 0) ? 0 : 49;
            const grandTotal = selectedTotal + tax + shipping;

            summary.innerHTML = `
                <h2>Order Summary</h2>
                <div class="summary-row">
                    <span class="label">Selected Items (${selectedCount})</span>
                    <span>₹${formatPrice(selectedTotal)}</span>
                </div>
                <div class="summary-row">
                    <span class="label">Tax (5% GST)</span>
                    <span>₹${formatPrice(tax)}</span>
                </div>
                <div class="summary-row">
                    <span class="label">Shipping</span>
                    <span>${shipping === 0 ? '<span style="color:var(--success)">FREE</span>' : '₹' + shipping}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>₹${formatPrice(grandTotal)}</span>
                </div>
                <button onclick="handleCheckout()" class="btn btn-primary btn-lg" style="width:100%" ${selectedCount === 0 ? 'disabled' : ''}>
                    Proceed to Checkout
                </button>
                <button class="btn btn-secondary" style="width:100%;margin-top:0.75rem" onclick="clearCart()">Clear Cart</button>
            `;
        }
    } catch (e) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Error loading cart</p>';
    }
}

async function updateCartQty(productId, quantity) {
    try {
        const resp = await fetch(`${API}/api/cart`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity })
        });
        const data = await resp.json();
        if (data.success) {
            cartCount = data.cartCount;
            updateCartBadge();
            loadCart();
        }
    } catch (e) { }
}

async function removeFromCart(productId) {
    try {
        const resp = await fetch(`${API}/api/cart/${productId}`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            cartCount = data.cartCount;
            updateCartBadge();
            showToast('Item removed', 'info');
            loadCart();
        }
    } catch (e) { }
}

async function clearCart() {
    try {
        const resp = await fetch(`${API}/api/cart/clear`, { method: 'DELETE' });
        const data = await resp.json();
        if (data.success) {
            cartCount = 0;
            updateCartBadge();
            loadCart();
        }
    } catch (e) { }
}

// Selective Selection Helpers
function toggleItemSelection(productId, isSelected) {
    if (isSelected) {
        selectedProductIds.add(productId);
    } else {
        selectedProductIds.delete(productId);
    }
    loadCart(); // Refresh summary and state
}

async function toggleSelectAll(isSelected) {
    try {
        const resp = await fetch(`${API}/api/cart`);
        const data = await resp.json();
        if (isSelected) {
            data.items.forEach(item => selectedProductIds.add(item.productId));
        } else {
            selectedProductIds.clear();
        }
        // Once user manually unselects all, we shouldn't re-select them automatically
        isCartFirstLoad = false;
        loadCart();
    } catch (e) { }
}

function handleCheckout() {
    if (selectedProductIds.size === 0) {
        showToast('Please select at least one item', 'info');
        return;
    }
    // Store selected IDs in sessionStorage for checkout page to pick up
    sessionStorage.setItem('selectedProductIds', JSON.stringify(Array.from(selectedProductIds)));
    window.location.href = 'checkout.html';
}

// ─── Checkout ───
async function loadCheckout() {
    const itemsContainer = document.getElementById('checkoutItems');
    if (!itemsContainer) return;

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const resp = await fetch(`${API}/api/cart`);
        const data = await resp.json();

        if (data.items.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        const selectedIds = JSON.parse(sessionStorage.getItem('selectedProductIds') || '[]');
        const filteredItems = selectedIds.length > 0
            ? data.items.filter(it => selectedIds.includes(it.productId))
            : data.items;

        if (filteredItems.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        itemsContainer.innerHTML = filteredItems.map(item => `
            <div class="order-item-mini">
                <img src="${item.productImage}" alt="${item.productName}">
                <div class="item-info">
                    <h4>${item.productName}</h4>
                    <p>Qty: ${item.quantity} × ₹${formatPrice(item.productPrice)}</p>
                </div>
                <span style="font-weight:600">₹${formatPrice(item.subtotal)}</span>
            </div>
        `).join('');

        const filteredTotal = filteredItems.reduce((acc, it) => acc + (it.productPrice * it.quantity), 0);
        const tax = filteredTotal * 0.05;
        const shipping = filteredTotal >= 500 ? 0 : 49;

        document.getElementById('checkoutSubtotal').textContent = `₹${formatPrice(filteredTotal)}`;
        document.getElementById('checkoutTax').textContent = `₹${formatPrice(tax)}`;
        document.getElementById('checkoutShipping').innerHTML = shipping === 0 ? '<span style="color:var(--success)">FREE</span>' : `₹${shipping}`;
        document.getElementById('checkoutTotal').textContent = `₹${formatPrice(filteredTotal + tax + shipping)}`;
    } catch (e) {
        showToast('Error loading checkout', 'error');
    }
}

async function placeOrder(e) {
    e.preventDefault();
    const address = document.getElementById('address').value;
    const payment = document.getElementById('paymentMethod').value;

    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Placing Order...';

    try {
        const selectedProductIds = JSON.parse(sessionStorage.getItem('selectedProductIds') || '[]');
        const resp = await fetch(`${API}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shippingAddress: address,
                paymentMethod: payment,
                selectedProductIds: selectedProductIds
            })
        });
        const data = await resp.json();
        if (data.success) {
            cartCount = 0;
            updateCartBadge();
            showOrderSuccess(data.orderId);
        } else {
            showToast(data.error || 'Order failed', 'error');
            btn.disabled = false;
            btn.textContent = 'Place Order';
        }
    } catch (e) {
        showToast('Network error', 'error');
        btn.disabled = false;
        btn.textContent = 'Place Order';
    }
}

function showOrderSuccess(orderId) {
    window.location.href = `order-success.html?id=${orderId}`;
}

// ─── Orders ───
async function loadOrders() {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    container.innerHTML = '<div class="spinner"></div>';

    try {
        const resp = await fetch(`${API}/api/orders`);
        const orders = await resp.json();

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">📦</div>
                    <h3>No orders yet</h3>
                    <p>Your order history will appear here</p>
                    <a href="products.html" class="btn btn-primary">Start Shopping</a>
                </div>`;
            return;
        }

        container.innerHTML = orders.map(o => `
            <div class="order-card fade-in">
                <div class="order-header">
                    <div>
                        <span class="order-id">Order #${o.id}</span>
                        <span style="color:var(--text-muted);margin-left:10px;font-size:0.85rem">${formatDate(o.createdAt)}</span>
                    </div>
                    <span class="order-status ${o.status}">${o.status}</span>
                </div>

                <div class="tracking-container">
                    ${getTrackingTimeline(o.status)}
                </div>

                <div>
                    ${o.items.map(item => `
                        <div class="order-item-mini">
                            <img src="${item.productImage}" alt="${item.productName}">
                            <div class="item-info">
                                <h4>${item.productName}</h4>
                                <p>Qty: ${item.quantity} × ₹${formatPrice(item.price)}</p>
                            </div>
                            <span style="font-weight:600">₹${formatPrice(item.price * item.quantity)}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:1rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.06)">
                    <button class="btn btn-secondary btn-sm" onclick="generateInvoice(${o.id})">📄 Generate Bill</button>
                    <div style="text-align:right">
                        <span style="color:var(--text-muted)">Total:</span>
                        <span style="font-size:1.2rem;font-weight:700;margin-left:8px">₹${formatPrice(o.totalAmount)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Error loading orders</p>';
    }
}

function getTrackingTimeline(status) {
    const steps = [
        { key: 'PENDING', label: 'Placed', icon: '📝' },
        { key: 'CONFIRMED', label: 'Confirmed', icon: '📦' },
        { key: 'SHIPPED', label: 'Shipped', icon: '🚚' },
        { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🚛' },
        { key: 'DELIVERED', label: 'Delivered', icon: '🎉' }
    ];

    if (status === 'CANCELLED') {
        return `<div style="color:var(--danger); text-align:center; font-weight:600; font-size:0.9rem;">🚫 This order was cancelled</div>`;
    }

    const currentIndex = steps.findIndex(s => s.key === status);
    const progressWidth = currentIndex === -1 ? 0 : (currentIndex / (steps.length - 1)) * 80;

    return `
        <div class="tracking-timeline">
            <div class="tracking-progress-fill" style="width: ${progressWidth}%"></div>
            ${steps.map((step, index) => {
        let stateClass = '';
        if (index < currentIndex) stateClass = 'completed';
        else if (index === currentIndex) stateClass = 'active';

        return `
                    <div class="tracking-step ${stateClass}">
                        <div class="step-marker">${step.icon}</div>
                        <div class="step-label">${step.label}</div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function generateInvoice(orderId) {
    window.location.href = `invoice.html?id=${orderId}`;
}

// ─── Helpers ───
function productCard(p) {
    return `
        <div class="product-card fade-in" onclick="window.location.href='product-detail.html?id=${p.id}'">
            ${p.discount > 0 ? `<div class="badge">${p.discount}% OFF</div>` : ''}
            <div class="img-wrapper">
                <img class="product-img" src="${p.imageUrl}" alt="${p.name}" loading="lazy">
                <div class="quick-actions">
                    <button onclick="event.stopPropagation(); addToCart(${p.id})" title="Add to Cart">🛒</button>
                </div>
            </div>
            <div class="product-info">
                <span class="category-label">${p.categoryName || ''}</span>
                <h3>${p.name}</h3>
                <div class="rating">
                    <span class="stars">${renderStars(p.rating)}</span>
                    <span class="review-count">(${formatNumber(p.reviewCount)})</span>
                </div>
                <div class="price-row">
                    <span class="price">₹${formatPrice(p.price)}</span>
                    ${p.originalPrice ? `<span class="original-price">₹${formatPrice(p.originalPrice)}</span>` : ''}
                    ${p.discount > 0 ? `<span class="discount-tag">${p.discount}% off</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '★' : '') + '☆'.repeat(empty);
}

function formatPrice(price) {
    return parseFloat(price).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatNumber(num) {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
}

function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
}

// ─── Toast ───
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ─── Navbar ───
function initNavbar() {
    // Scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    }
}

// ─── Page Router ───
function initPage() {
    const page = document.body.dataset.page;
    switch (page) {
        case 'home':
            loadFeaturedProducts();
            loadCategoriesGrid();
            break;
        case 'products':
            loadProducts();
            loadCategories();
            break;
        case 'product-detail':
            loadProductDetail();
            break;
        case 'cart':
            loadCart();
            break;
        case 'checkout':
            loadCheckout();
            break;
        case 'orders':
            loadOrders();
            break;
    }
}
