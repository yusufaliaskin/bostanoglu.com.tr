/* shop.js - Product Detail Logic & Mobile Menu */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollEffects(); // Added Animation Logic
    loadProductDetail();
});

// --- SHARED ANIMATIONS & MENU ---
function initMobileMenu() {
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

    function closeMenu() {
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
}

function initScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const reveals = document.querySelectorAll('.reveal-text, .scroll-reveal');
    reveals.forEach(el => observer.observe(el));
}


// --- PRODUCT DETAIL LOGIC ---
function loadProductDetail() {
    // Get ID from URL
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    // Select Elements
    const nameEl = document.getElementById('productName');
    const priceEl = document.getElementById('productPrice');
    const brandEl = document.getElementById('productBrand');
    const descEl = document.getElementById('productDesc');
    const imgEl = document.getElementById('productImage');
    const loaderEl = document.getElementById('imageLoader');
    const platformListEl = document.getElementById('platformList');
    const platformCardEl = document.getElementById('platformCard');

    if (!productId) {
        nameEl.textContent = 'Ürün Bulunamadı';
        descEl.textContent = 'Geçersiz ürün ID\'si.';
        loaderEl.style.display = 'none'; // Hide loader
        return;
    }

    // Check source data
    if (!window.products) {
        console.error("Data not found: window.products is undefined");
        nameEl.textContent = 'Veri Hatası';
        descEl.textContent = 'Ürün verileri yüklenemedi. Lütfen sayfayı yenileyin.';
        loaderEl.style.display = 'none';
        return;
    }

    // Find product in data.js (window.products)
    const product = window.products.find(p => p.id === productId);

    if (!product) {
        nameEl.textContent = 'Ürün Bulunamadı';
        descEl.textContent = 'Aradığınız ürün sistemimizde mevcut değil.';
        loaderEl.style.display = 'none'; // Hide loader
        return;
    }

    // Render Data
    document.title = `${product.name} | Bostanoğlu`; // Update Page Title
    nameEl.textContent = product.name;
    brandEl.textContent = product.brand;
    priceEl.textContent = formatCurrency(product.price);

    // Description - Use generic text if missing
    if (product.description) {
        descEl.textContent = product.description;
    } else {
        descEl.textContent = "Bu ürün için henüz detaylı açıklama girilmemiştir. Ürün özellikleri ve stok durumu hakkında bilgi almak için bizimle iletişime geçebilirsiniz.";
    }

    // Image Handling
    const imgSource = product.image ? product.image : 'https://placehold.co/600x800?text=No+Image';

    // Preload Image to avoid "jump"
    const tempImg = new Image();
    tempImg.src = imgSource;
    tempImg.onload = () => {
        imgEl.src = imgSource;
        loaderEl.style.display = 'none';
        imgEl.style.display = 'block';
        setTimeout(() => { imgEl.style.opacity = '1'; }, 50);
    };
    tempImg.onerror = () => {
        imgEl.src = 'https://placehold.co/600x800?text=Image+Error';
        loaderEl.style.display = 'none';
        imgEl.style.display = 'block';
    }


    breadcrumbUpdate(product.name);

    // Render Platforms
    renderPlatforms(product, platformListEl, platformCardEl);
}

function breadcrumbUpdate(name) {
    const el = document.getElementById('breadcrumbCurrent');
    if (el) el.textContent = name;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}

function renderPlatforms(product, container, card) {
    if (!container) return;
    container.innerHTML = '';

    // Mock Prices
    const platforms = [
        { name: 'Trendyol', price: product.price * 1.05, url: 'https://www.trendyol.com/magaza/bostanoglu-shop-m-1123604' },
        { name: 'Hepsiburada', price: product.price * 1.08, url: '#' },
        { name: 'N11', price: product.price * 1.04, url: '#' },
        { name: 'Bostanoğlu', price: product.price, url: '#', isBest: true }
    ];

    card.style.display = 'block';
    // Animate Card
    card.classList.add('scroll-reveal');
    setTimeout(() => card.classList.add('visible'), 500);

    platforms.forEach(p => {
        const row = document.createElement('div');
        row.className = 'platform-row';

        let logoIcon = '<i class="fa-solid fa-shop"></i>';
        if (p.name === 'Trendyol') logoIcon = '<i class="fa-solid fa-bag-shopping" style="color:var(--accent);"></i>';

        row.innerHTML = `
            <div class="platform-name">
                ${logoIcon} ${p.name}
            </div>
            <div class="platform-price">
                ${formatCurrency(p.price)}
            </div>
            <div>
                <a href="${p.url}" target="_blank" class="btn-visit ${p.isBest ? 'best-price' : ''}">
                    ${p.isBest ? 'Mağazada Gör' : 'İncele'}
                </a>
            </div>
        `;
        container.appendChild(row);
    });
}
