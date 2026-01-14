/* collections.js - Product Redesign Logic */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollEffects();
    initMobileFilters(); // New Drawer Logic
    loadProducts();      // Initial Load
    initFiltering();     // Event Listeners
});

// --- 1. MOBILE DRAWER LOGIC ---
function initMobileFilters() {
    const filterBtn = document.getElementById('mobileFilterBtn');
    const closeBtn = document.getElementById('closeFilterBtn');
    const applyBtn = document.getElementById('mobileApplyFilters');
    const sidebar = document.getElementById('filterSidebar');

    function toggleDrawer() {
        sidebar.classList.toggle('active');
        if (sidebar.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('filter-open');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('filter-open');
        }
    }

    if (filterBtn) filterBtn.addEventListener('click', toggleDrawer);
    if (closeBtn) closeBtn.addEventListener('click', toggleDrawer);
    if (applyBtn) applyBtn.addEventListener('click', toggleDrawer); // Close on apply
}


// --- 2. SHARED ANIMATIONS (Header/Scroll) ---
function initMobileMenu() {
    /* Standard logic matched with index.js */
    const openBtn = document.getElementById('openMenuBtn');
    const closeBtn = document.getElementById('closeMenuBtn');
    const menu = document.getElementById('mobileMenu');
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-text, .scroll-reveal').forEach(el => observer.observe(el));

    window.refreshAnimations = () => {
        document.querySelectorAll('.scroll-reveal:not(.visible)').forEach(el => observer.observe(el));
    };
}


// --- 3. PRODUCT RENDERING ---
function loadProducts(filterCategory = 'all', filterBrand = 'all', sortType = 'default', minPrice = 0, maxPrice = Infinity) {
    const grid = document.getElementById('productGrid');
    const countLabel = document.getElementById('countLabel');
    const countLabelMobile = document.getElementById('countLabelMobile');

    if (!grid) return;
    grid.innerHTML = '';

    // Safety Check
    if (!window.products) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Veri yüklenemedi.</p>';
        return;
    }

    // Use DB instead of window.products
    let products = DB.getAll();

    // Filter
    let filtered = products.filter(p => {
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        const matchesBrand = filterBrand === 'all' || p.brand.toLowerCase() === filterBrand.toLowerCase();
        const matchesPrice = p.price >= minPrice && (maxPrice === Infinity || p.price <= maxPrice);
        return matchesCategory && matchesBrand && matchesPrice;
    });

    // Sort
    if (sortType === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortType === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortType === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

    // Update Counts
    const countText = `${filtered.length} Ürün`;
    if (countLabel) countLabel.textContent = countText;
    if (countLabelMobile) countLabelMobile.textContent = countText;

    // Render
    filtered.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'listing-card scroll-reveal';
        card.style.transitionDelay = `${(index % 3) * 0.05}s`; // Fast stagger

        const imgSrc = p.image || 'https://placehold.co/600x800?text=No+Image';

        let imgHtml = `<img src="${imgSrc}" alt="${p.name}" class="img-main">`;
        if (p.hoverImage) {
            imgHtml += `<img src="${p.hoverImage}" alt="${p.name}" class="img-hover">`;
        }

        card.innerHTML = `
            <div class="img-wrapper">
                <button class="fav-btn"><i class="fa-regular fa-heart"></i></button>
                ${imgHtml}
            </div>
            <div class="info-box">
                <span class="brand-name">${p.brand}</span>
                <h4 class="prod-title">${p.name}</h4>
                <span class="prod-price">${formatCurrency(p.price)}</span>
            </div>
        `;

        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) window.location.href = `shop.html?id=${p.id}`;
        });

        grid.appendChild(card);
    });

    if (window.refreshAnimations) window.refreshAnimations();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}


// --- 4. FILTER EVENTS ---
function initFiltering() {
    // URL Param Logic
    const urlParams = new URLSearchParams(window.location.search);
    let currentCategory = urlParams.get('filter') || 'all';

    // Desktop/Mobile Links
    const buttons = document.querySelectorAll('.filter-link');
    const brandSelect = document.getElementById('brandSelect');
    const sortSelect = document.getElementById('sortSelect');
    const applyPriceBtn = document.getElementById('applyPriceBtn');
    const mobileApplyBtn = document.getElementById('mobileApplyFilters');

    // Category Buttons
    buttons.forEach(btn => {
        // Set Initial Active
        if (btn.dataset.filter === currentCategory) btn.classList.add('active');
        else btn.classList.remove('active');

        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.filter;
            applyAll();
        });
    });

    // Inputs
    if (brandSelect) brandSelect.addEventListener('change', applyAll);
    if (sortSelect) sortSelect.addEventListener('change', applyAll);
    if (applyPriceBtn) applyPriceBtn.addEventListener('click', applyAll);
    if (mobileApplyBtn) mobileApplyBtn.addEventListener('click', applyAll);

    // Apply Logic
    function applyAll() {
        const brand = brandSelect ? brandSelect.value : 'all';
        const sort = sortSelect ? sortSelect.value : 'default';

        const minVal = document.getElementById('minPrice').value;
        const maxVal = document.getElementById('maxPrice').value;
        const min = minVal ? parseFloat(minVal) : 0;
        const max = maxVal ? parseFloat(maxVal) : Infinity;

        loadProducts(currentCategory, brand, sort, min, max);
    }

    // Initial Trigger if param exists
    if (currentCategory !== 'all') {
        applyAll();
    }
}
