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
    const productId = params.get('id'); // ID is string now

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
        descEl.textContent = 'Geçersiz parametre.';
        loaderEl.style.display = 'none';
        return;
    }

    // Use DB instead of window.products
    const product = DB.getById(productId);

    if (!product) {
        nameEl.textContent = 'Ürün Bulunamadı';
        descEl.textContent = 'Aradığınız ürün sistemimizde mevcut değil.';
        loaderEl.style.display = 'none';
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

    // Render Wholesale
    renderWholesale(product);

    // Render Gallery
    renderGallery(product);
}

function renderGallery(product) {
    const container = document.getElementById('thumbnailContainer');
    const mainImg = document.getElementById('productImage');
    container.innerHTML = '';

    // Collect all images
    let images = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        images = product.images;
    } else {
        if (product.image) images.push(product.image);
        if (product.hoverImage) images.push(product.hoverImage);
    }

    // If only 1 or 0 images, don't show thumbnails
    if (images.length <= 1) return;

    images.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.className = 'thumb-img';
        if (index === 0) thumb.classList.add('active'); // First one active

        thumb.onclick = () => {
            // Switch Main Image
            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = src;
                mainImg.style.opacity = '1';
            }, 200);

            // Update Active State
            document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };

        container.appendChild(thumb);
    });
}

function renderWholesale(product) {
    const card = document.getElementById('wholesaleCard');
    const minQtyEl = document.getElementById('wsMinQty');
    const qtyInput = document.getElementById('wsQty');
    const whatsappBtn = document.getElementById('wsWhatsappBtn');

    // Check if active and configured
    if (!product.wholesale || !product.wholesale.active) {
        card.style.display = 'none';
        return;
    }

    const minQty = product.wholesale.minQty || 10;

    // UI Update
    card.style.display = 'block';
    minQtyEl.textContent = minQty;
    qtyInput.value = minQty;
    qtyInput.min = minQty;

    // Logic
    document.getElementById('wsDecQty').onclick = () => {
        let val = parseInt(qtyInput.value);
        if (val > minQty) qtyInput.value = val - 1;
    };

    document.getElementById('wsIncQty').onclick = () => {
        let val = parseInt(qtyInput.value);
        qtyInput.value = val + 1;
    };

    // WhatsApp Click
    whatsappBtn.onclick = () => {
        const settings = JSON.parse(localStorage.getItem('adminSettings')) || {};
        const phone = settings.whatsapp || '905370248528';

        if (!phone) {
            alert('Mağaza iletişim numarası ayarlanmamış. Lütfen yönetici ile iletişime geçin.');
            return;
        }

        const qty = qtyInput.value;
        const text = `Merhaba, ${product.name} ürünü için toptan fiyat teklifi almak istiyorum. Adet: ${qty}`;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

        window.open(url, '_blank');
    };
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


    card.style.display = 'block';
    card.classList.add('scroll-reveal');
    setTimeout(() => card.classList.add('visible'), 500);

    // Use Product Platforms if available, otherwise default to "Bostanoğlu"
    const platformsData = (product.platforms && product.platforms.length > 0)
        ? product.platforms
        : [{ name: 'Bostanoğlu', price: product.price, url: '#', isBest: true }];

    platformsData.forEach(p => {
        const row = document.createElement('div');
        row.className = 'platform-row';

        let logoIcon = '<i class="fa-solid fa-shop"></i>';
        if (p.name === 'Trendyol') logoIcon = '<i class="fa-solid fa-bag-shopping" style="color:#f27a1a;"></i>';
        if (p.name === 'Hepsiburada') logoIcon = '<i class="fa-solid fa-box" style="color:#ff6000;"></i>';
        if (p.name === 'N11') logoIcon = '<i class="fa-solid fa-bug" style="color:#5f4b8b;"></i>';
        if (p.name === 'Amazon') logoIcon = '<i class="fa-brands fa-amazon" style="color:#ff9900;"></i>';

        // Highlight best price or internal site
        const isBestData = p.name === 'Bostanoğlu' || p.isBest;

        row.innerHTML = `
            <div class="platform-name">
                ${logoIcon} ${p.name}
            </div>
            <div class="platform-price">
                ${formatCurrency(p.price)}
            </div>
            <div>
                <a href="${p.url}" target="_blank" class="btn-visit ${isBestData ? 'best-price' : ''}">
                    ${isBestData ? 'Mağazada Gör' : 'İncele'}
                </a>
            </div>
        `;
        container.appendChild(row);
    });
}
