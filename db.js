/* db.js - Central Data Manager */

const DB = {
    KEY: 'bostanoglu_products_v1',

    // Initialize
    init() {
        if (!localStorage.getItem(this.KEY)) {
            // Start empty as requested by user architecture
            this.saveAll([]);
            console.log('DB: Initialized empty storage.');
        }
    },

    // Get All Products
    getAll() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },

    // Get Single Product
    getById(id) {
        const products = this.getAll();
        // ID is now string, so strict comparison is fine if consistent
        return products.find(p => p.id == id);
    },

    // Save/Update Product
    saveProduct(product) {
        let products = this.getAll();

        if (product.id) {
            // Update existing
            const index = products.findIndex(p => p.id == product.id);
            if (index !== -1) {
                products[index] = { ...products[index], ...product };
            } else {
                products.push(product);
            }
        } else {
            // Create new with robust ID
            const newId = 'prd_' + Date.now();
            product.id = newId;
            product.createdAt = Date.now();
            products.push(product);
        }

        this.saveAll(products);
        return product;
    },

    // Delete Product
    deleteProduct(id) {
        let products = this.getAll();
        products = products.filter(p => p.id != id);
        this.saveAll(products);
    },

    // Internal Save
    saveAll(products) {
        localStorage.setItem(this.KEY, JSON.stringify(products));
        // Dispatch event for live updates if needed across tabs
        window.dispatchEvent(new Event('db-updated'));
    },

    // Clear All Data (No Restore)
    clearAll() {
        this.saveAll([]); // Save empty array
    },

    // Reset to Default (Restore from data.js)
    reset() {
        localStorage.removeItem(this.KEY);
        location.reload();
    }
};

// Auto-init on load
document.addEventListener('DOMContentLoaded', () => {
    DB.init();
});
