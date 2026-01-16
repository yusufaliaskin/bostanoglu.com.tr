/* cart.js - Shopping Cart Logic */

const CART_KEY = 'bostanoglu_cart_v1';

const Cart = {
    // Init Cart
    init() {
        this.renderCartIcon();
        this.renderDrawer();
        this.updateDrawerUI();
    },

    // Get Data
    getItems() {
        const data = localStorage.getItem(CART_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Save Data
    saveItems(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
        this.updateDrawerUI();
        window.dispatchEvent(new Event('cart-updated')); // Notify other components
    },

    // Add Item
    add(product, quantity = 1, options = {}) {
        let items = this.getItems();

        // Check if same product + same options exists
        const existingIndex = items.findIndex(item =>
            item.id === product.id &&
            JSON.stringify(item.options) === JSON.stringify(options)
        );

        if (existingIndex > -1) {
            items[existingIndex].quantity += quantity;
        } else {
            items.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image_url || ((product.images && product.images[0]) ? product.images[0] : ''),
                quantity: quantity,
                options: options
            });
        }

        this.saveItems(items);
        this.openDrawer();
    },

    // Remove Item
    remove(index) {
        let items = this.getItems();
        items.splice(index, 1);
        this.saveItems(items);
    },

    // Update Quantity
    updateQuantity(index, newQty) {
        let items = this.getItems();
        if (newQty < 1) return;
        items[index].quantity = newQty;
        this.saveItems(items);
    },

    // Clear Cart
    clear() {
        this.saveItems([]);
    },

    // Calculate Total
    getTotal() {
        const items = this.getItems();
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // UI: Open/Close Drawer
    openDrawer() {
        document.getElementById('cartDrawer').classList.add('active');
        document.getElementById('cartOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    closeDrawer() {
        document.getElementById('cartDrawer').classList.remove('active');
        document.getElementById('cartOverlay').classList.remove('active');
        document.body.style.overflow = '';
    },

    // Render Drawer HTML (Once)
    renderDrawer() {
        if (document.getElementById('cartDrawer')) return; // Already rendered

        const html = `
            <div class="cart-overlay" id="cartOverlay"></div>
            <div class="cart-drawer" id="cartDrawer">
                <div class="cart-header">
                    <h3>Sepetim</h3>
                    <button id="closeCartBtn"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="cart-body" id="cartBody">
                    <!-- Items injected here -->
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Toplam:</span>
                        <span id="cartTotalRaw">0.00 TL</span>
                    </div>
                    <a href="checkout.html" class="btn btn-primary btn-full">Siparişi Tamamla</a>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);

        // Events
        document.getElementById('closeCartBtn').addEventListener('click', () => this.closeDrawer());
        document.getElementById('cartOverlay').addEventListener('click', () => this.closeDrawer());
    },

    // Update Drawer Content
    updateDrawerUI() {
        const items = this.getItems();
        const container = document.getElementById('cartBody');
        if (!container) return;

        const totalEl = document.getElementById('cartTotalRaw');
        const countBadges = document.querySelectorAll('.cart-count-badge');

        // Update Badge
        const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
        countBadges.forEach(b => {
            b.textContent = totalCount;
            b.style.display = totalCount > 0 ? 'flex' : 'none';
        });

        // Update Total
        if (totalEl) totalEl.textContent = this.formatPrice(this.getTotal());

        // Update List
        container.innerHTML = '';
        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>Sepetiniz boş.</p>
                    <button onclick="Cart.closeDrawer()" class="btn btn-outline btn-sm">Alışverişe Başla</button>
                </div>`;
            return;
        }

        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.image || 'https://placehold.co/100'}" alt="img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-meta">Adet: ${item.quantity}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price * item.quantity)}</div>
                </div>
                <button class="cart-remove-btn" onclick="Cart.remove(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;
            container.appendChild(div);
        });
    },

    // Render Icon (If needed specially, but usually static in HTML)
    renderCartIcon() {
        // Just listener binding for existing icons
        document.querySelectorAll('.open-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openDrawer();
            });
        });
    },

    formatPrice(amount) {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
    }
};

// Auto Init
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});
