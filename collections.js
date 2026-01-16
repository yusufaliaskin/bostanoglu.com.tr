/* collections.js - Supabase Integration */

let allProducts = [];
let currentFilter = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
    // Parse URL params first
    const params = new URLSearchParams(window.location.search);
    if (params.has('filter')) currentFilter = params.get('filter');
    if (params.has('search')) searchQuery = params.get('search');

    initMobileMenu();
    initScrollEffects();
    initFilterDrawer();
    initFiltering();

    await loadProducts();
});

// --- 1. MOBILE DRAWER LOGIC ---
// --- 1. FILTER DRAWER LOGIC ---
function initFilterDrawer() {
    const filterBtn = document.getElementById('toggleFilterBtn');
    const closeBtn = document.getElementById('closeFilterBtn');
    const applyBtn = document.getElementById('mobileApplyFilters');
    const sidebar = document.getElementById('filterSidebar');

    // Inject Sidebar Styles removed - now handled in collections.css

    // Backdrop removed as per user request (no auto-close on outside click)

    function toggleDrawer() {
        if (!sidebar) return;

        // Toggle Sidebar
        sidebar.classList.toggle('active');

        // Toggle Body Class for Layout Shift (Push Effect)
        document.body.classList.toggle('filter-open');
    }

    if (filterBtn) filterBtn.addEventListener('click', toggleDrawer);
    if (closeBtn) closeBtn.addEventListener('click', toggleDrawer);
    if (applyBtn) applyBtn.addEventListener('click', toggleDrawer);
}

// --- 2. MOBILE MENU ---
function initMobileMenu() {
    const openBtn = document.getElementById('openMenuBtn');
    const closeBtn = document.getElementById('closeMenuBtn');
    const menu = document.getElementById('mobileMenu');

    if (openBtn && menu) openBtn.addEventListener('click', () => menu.classList.add('active'));
    if (closeBtn && menu) closeBtn.addEventListener('click', () => menu.classList.remove('active'));

    // Sticky header logic or other scroll interactions can go here if needed
}

// --- 3. FILTERING LOGIC ---
function initFiltering() {
    const brandSelect = document.getElementById('brandSelect');
    const sortSelect = document.getElementById('sortSelect');
    const applyPriceBtn = document.getElementById('applyPriceBtn');
    const mobileApplyBtn = document.getElementById('mobileApplyFilters');
    const minInput = document.getElementById('minPrice');
    const maxInput = document.getElementById('maxPrice');

    // Category Buttons
    document.querySelectorAll('.filter-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.filter-link').forEach(a => a.classList.remove('active'));
            link.classList.add('active');

            const val = link.dataset.filter;
            if (val === 'all') {
                currentFilter = 'all';
                searchQuery = '';
            } else {
                currentFilter = val;
                searchQuery = '';
            }

            // Update URL
            const url = new URL(window.location);
            if (currentFilter !== 'all') url.searchParams.set('filter', currentFilter);
            else url.searchParams.delete('filter');
            url.searchParams.delete('search');
            window.history.pushState({}, '', url);

            renderProducts();
        });
    });

    // Set initial active button state based on URL/Globals
    if (searchQuery) {
        // Deselect all category buttons if searching
        document.querySelectorAll('.filter-link').forEach(a => a.classList.remove('active'));
    } else if (currentFilter) {
        const link = document.querySelector(`.filter-link[data-filter="${currentFilter}"]`);
        if (link) {
            document.querySelectorAll('.filter-link').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        }
    }

    // Common apply function
    const applyAll = () => renderProducts();

    if (brandSelect) brandSelect.addEventListener('change', applyAll);
    if (sortSelect) sortSelect.addEventListener('change', applyAll);
    if (applyPriceBtn) applyPriceBtn.addEventListener('click', applyAll);
    if (mobileApplyBtn) mobileApplyBtn.addEventListener('click', applyAll);

    // Auto-apply on Enter for price
    if (minInput) minInput.addEventListener('change', applyAll);
    if (maxInput) maxInput.addEventListener('change', applyAll);
}

// --- 4. DATA LOADING ---
async function loadProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '<div class="loader"><i class="fa-solid fa-spinner fa-spin"></i></div>';

    // Fetch from Local DB (synced with Admin)
    // Delay for realism
    await new Promise(r => setTimeout(r, 500));

    const data = DB.getProducts();

    if (!data || data.length === 0) {
        grid.innerHTML = '<p>Ürün bulunamadı.</p>';
        return;
    }

    allProducts = data;
    renderProducts();
}

// --- 5. RENDER LOGIC ---
function renderProducts() {
    let filtered = allProducts;
    const grid = document.getElementById('productGrid');
    const titleEl = document.querySelector('.page-title');
    const countLabel = document.getElementById('countLabel');
    const countLabelMobile = document.getElementById('countLabelMobile');

    if (!grid) return;

    // A. Filter by Search
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.brand && p.brand.toLowerCase().includes(q))
        );
        if (titleEl) titleEl.textContent = `Arama Sonuçları: "${searchQuery}"`;
    }
    // B. Filter by Category
    else if (currentFilter !== 'all') {
        if (currentFilter === 'new') {
            filtered = [...allProducts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            if (titleEl) titleEl.textContent = 'Yeni Gelenler';
        } else {
            filtered = filtered.filter(p => {
                // 1. Strict Category Match (Admin assigned category)
                if (p.category === currentFilter) return true;

                // 2. Name/Brand Fallback Search
                const searchStr = (p.name + ' ' + (p.brand || '')).toLowerCase();
                if (currentFilter === 'saat') return searchStr.includes('saat');
                if (currentFilter === 'elbise') return searchStr.includes('elbise');
                if (currentFilter === 'taki') return searchStr.includes('takı') || searchStr.includes('kolye') || searchStr.includes('küpe');
                if (currentFilter === 'kahve') return searchStr.includes('kahve') || searchStr.includes('coffee');

                // Fallback: simple text match
                return searchStr.includes(currentFilter);
            });

            // Dynamic Title Mapping
            const mapTitle = {
                'saat': 'Saat Koleksiyonu',
                'elbise': 'Elbise Koleksiyonu',
                'taki': 'Takı & Aksesuar',
                'kahve': 'Kahve',
                'tulum': 'Tulumlar', // Example for dynamic ones
                'ayakkabi': 'Ayakkabılar'
            };
            if (titleEl) {
                // Use mapped title OR capitalize the slug
                titleEl.textContent = mapTitle[currentFilter] || (currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1));
            }
        }
    } else {
        if (titleEl) titleEl.textContent = 'Tüm Ürünler';
    }

    // C. Filter by Price
    const minVal = document.getElementById('minPrice')?.value;
    const maxVal = document.getElementById('maxPrice')?.value;
    if (minVal) filtered = filtered.filter(p => p.price >= parseFloat(minVal));
    if (maxVal) filtered = filtered.filter(p => p.price <= parseFloat(maxVal));

    // D. Filter by Brand
    const brandSelect = document.getElementById('brandSelect');
    if (brandSelect && brandSelect.value !== 'all') {
        filtered = filtered.filter(p => (p.brand || '').toLowerCase() === brandSelect.value.toLowerCase());
    }

    // E. Sorting
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        const sort = sortSelect.value;
        if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
        else if (sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Update Counts
    const countText = `${filtered.length} Ürün`;
    if (countLabel) countLabel.textContent = countText;
    if (countLabelMobile) countLabelMobile.textContent = countText;

    // Render HTML
    grid.innerHTML = '';
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="no-results">Aradığınız kriterlere uygun ürün bulunamadı.</div>';
        return;
    }

    filtered.forEach(product => {
        let imgSrc = product.image_url;
        if (!imgSrc && product.images && product.images.length > 0) imgSrc = product.images[0];
        if (!imgSrc) imgSrc = 'https://placehold.co/600x800';

        const isNew = isNewProduct(product.created_at);

        const card = document.createElement('div');
        card.className = 'product-card fade-in';
        card.onclick = (e) => {
            if (!e.target.closest('button')) {
                window.location.href = `shop.html?id=${product.id}`;
            }
        };

        card.innerHTML = `
            <div class="pc-img-wrapper">
                ${isNew ? '<span class="pc-new-badge">YENİ</span>' : ''}
                <a href="shop.html?id=${product.id}">
                    <img src="${imgSrc}" alt="${product.name}" loading="lazy">
                </a>
                <div class="pc-actions d-desktop">
                    <button class="btn-quick-add" onclick="addToCart('${product.id}', event)">
                        <i class="fa-solid fa-plus"></i> Sepete Ekle
                    </button>
                </div>
            </div>
            <div class="pc-info">
                <div>
                    <div class="pc-brand">${product.brand || 'Bostanoğlu'}</div>
                    <a href="shop.html?id=${product.id}" style="text-decoration:none;">
                        <h3 class="pc-title">${product.name}</h3>
                    </a>
                </div>
                <div class="pc-price">
                    ${product.old_price ? `<span class="old">${formatPrice(product.old_price)}</span>` : ''}
                    ${formatPrice(product.price)}
                </div>
                
                <!-- Mobile Only Add Button -->
                <button class="btn d-mobile btn-sm btn-black" style="width:100%; margin-top:10px;" onclick="addToCart('${product.id}', event)">
                    Sepete Ekle
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Re-init observer for scroll animations if needed
    if (window.initScrollEffects) window.initScrollEffects();
}

function isNewProduct(dateStr) {
    if (!dateStr) return false;
    const diff = new Date() - new Date(dateStr);
    return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
}

function formatPrice(p) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p);
}


// Mock Add to Cart Wrapper for Collections
async function addToCart(id, e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Check if cart.js is loaded
    if (window.cart && window.cart.addItem) {
        await window.cart.addItem(id, 1);
    } else {
        // Fallback logic if cart.js isn't exposed exactly this way
        // Usually cart.js exposes global functions
        alert('Ürün sepete eklendi (Simülasyon)');
    }
}

// --- 6. SCROLL EFFECTS ---
function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    });

    const targets = document.querySelectorAll('.scroll-reveal');
    targets.forEach(t => observer.observe(t));
}
