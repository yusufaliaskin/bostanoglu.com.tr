/* shop.js - Product Detail Logic */

// Main Loader
document.addEventListener('DOMContentLoaded', loadProductDetail);

async function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const container = document.getElementById('productDetailContainer');

    if (!container) return; // Safety

    if (!productId) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px;"><h2>Ürün Seçilmedi</h2><p>Lütfen bir ürün seçin.</p><a href="collections.html" class="btn btn-black" style="margin-top:20px; display:inline-block; padding:10px 20px; background:#000; color:#fff; text-decoration:none;">Koleksiyona Dön</a></div>';
        return;
    }

    // Delay for realism if desired
    await new Promise(r => setTimeout(r, 400));

    // FETCH FROM LOCAL DB (db.js)
    const product = DB.getProductById(productId);

    if (!product) {
        container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px;"><h2>Ürün Bulunamadı</h2><p>Aradığınız ürün mevcut değil veya silinmiş.</p><a href="collections.html" class="btn btn-black" style="margin-top:20px; display:inline-block; padding:10px 20px; background:#000; color:#fff; text-decoration:none;">Koleksiyona Dön</a></div>';
        return;
    }

    // Set Page Title
    document.title = `${product.name} | Bostanoğlu`;

    // Prepare Images
    let images = [];
    if (product.images && product.images.length > 0) images = product.images;
    else if (product.image_url) images = [product.image_url];
    else images = ['https://placehold.co/600x750?text=No+Image'];

    // Generate Thumbnails HTML
    const thumbsHtml = images.map((img, idx) => `
        <div class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchImage('${img}', this)">
            <img src="${img}" alt="${product.name}">
        </div>
    `).join('');

    // Description Truncation Logic
    const fullDesc = product.description || `Longines Master Collection, horolojik işçiliğin ve zamansız zarafetin zirvesini temsil eder. Bu sembolik seri, her biri teknik mükemmelliğe olan sarsılmaz bağlılığı örnekleyen, titizlikle hazırlanmış bir dizi modelden oluşur.`;
    const isLong = fullDesc.length > 250;
    const shortDesc = isLong ? fullDesc.substring(0, 250) + '...' : fullDesc;
    const remainingDesc = isLong ? fullDesc.substring(250) : '';

    // Render Full Layout (Refined & Animated)
    container.innerHTML = `
        <!-- BREADCRUMBS -->
        <div class="pd-breadcrumbs animate-item">
            <a href="index.html">Ana Sayfa</a> <span>-</span>
            <a href="collections.html">Koleksiyonlar</a> <span>-</span>
            <a href="collections.html?filter=saat">Saatler</a> <span>-</span>
            <span>${product.name}</span>
        </div>

        <!-- LEFT: GALLERY -->
        <div class="pd-gallery animate-item" style="animation-delay: 0.1s;">
            <div class="main-image-viewport">
                <img id="mainImage" src="${images[0]}" alt="${product.name}">
            </div>
            
            <!-- Thumbnails -->
            ${images.length > 1 ? `
            <div class="thumbs-strip">
                ${thumbsHtml}
            </div>` : ''}

            <!-- DESCRIPTION BLOCK (Now positioned as requested, but logic is flexible) -->
            <!-- The user asked for description under the product name. 
                 Since this is the left column, we'll keep the Story here or move it? 
                 The prompt said: "acıklama urunun ısmı varya onun altında... 2. fotograftaki yer soldaki"
                 Let's place detailed description here as well or keep main description here? 
                 I'll keep the "Story" block here as "Detailed View" but the accordion info is on the right. 
                 Actually, the user said "soldaki yazı her zaman aynı... Kasa...". That refers to Accordions being consistent.
                 The description part: "urunun ismi varya onun altında". That is the Right Column (Title is there).
            -->
        </div>

        <!-- RIGHT: INFO -->
        <div class="pd-info">
            <!-- Badge -->
            <span class="pd-badge-new animate-item">Yeni Koleksiyon</span>
            
            <!-- Title -->
            <h1 class="pd-title animate-item" style="animation-delay: 0.1s;">${product.name}</h1>
            
            <!-- DESCRIPTION (Under Title as requested) -->
            <div class="pd-desc-text animate-item" style="animation-delay: 0.2s; margin-bottom: 20px; color:#555; line-height:1.6;">
                <span id="shortDesc">${shortDesc}</span>
                ${isLong ? `<span id="moreDesc" style="display:none">${remainingDesc}</span> 
                <a href="javascript:void(0)" onclick="toggleDescription()" id="readMoreBtn" style="color:#003153; font-weight:600; text-decoration:underline; font-size:0.9rem; margin-left:5px;">Daha fazlası</a>` : ''}
            </div>

            <!-- Price -->
            <div class="pd-price animate-item" style="animation-delay: 0.3s;">
                ${formatPrice(product.price)}
            </div>

            <!-- Button -->
            <div class="animate-item" style="animation-delay: 0.35s;">
                <button class="btn-add-main" onclick="addToCart('${product.id}')">
                    SEPETE EKLE
                </button>
            </div>

            <!-- Accordions (Specific Headers) -->
            <div class="pd-accordion animate-item" style="animation-delay: 0.5s;">
                
                <!-- KASA -->
                <div class="accordion-item">
                    <button class="accordion-header" onclick="toggleAccordion(this)">
                        KASA <i class="fa-solid fa-plus"></i>
                    </button>
                    <div class="accordion-content">
                        <p style="white-space: pre-line;">${(product.specs && product.specs.case) || '<strong>Malzeme:</strong> Paslanmaz Çelik<br><strong>Cam:</strong> Safir Kristal<br><strong>Su Geçirmezlik:</strong> 3 Bar'}</p>
                    </div>
                </div>

                <!-- KADRAN VE İBRELER -->
                <div class="accordion-item">
                    <button class="accordion-header" onclick="toggleAccordion(this)">
                        KADRAN VE İBRELER <i class="fa-solid fa-plus"></i>
                    </button>
                    <div class="accordion-content">
                        <p style="white-space: pre-line;">${(product.specs && product.specs.dial) || '<strong>Renk:</strong> Gümüş<br><strong>İbreler:</strong> Mavi Çelik'}</p>
                    </div>
                </div>

                <!-- MEKANİZMA VE FONKSİYONLAR -->
                <div class="accordion-item">
                    <button class="accordion-header" onclick="toggleAccordion(this)">
                        MEKANİZMA VE FONKSİYONLAR <i class="fa-solid fa-plus"></i>
                    </button>
                    <div class="accordion-content">
                        <p style="white-space: pre-line;">${(product.specs && product.specs.movement) || '<strong>Tip:</strong> Otomatik<br><strong>Kalibre:</strong> L888'}</p>
                    </div>
                </div>

                <!-- KAYIŞ -->
                <div class="accordion-item">
                    <button class="accordion-header" onclick="toggleAccordion(this)">
                        KAYIŞ <i class="fa-solid fa-plus"></i>
                    </button>
                    <div class="accordion-content">
                        <p style="white-space: pre-line;">${(product.specs && product.specs.strap) || '<strong>Malzeme:</strong> Deri<br><strong>Renk:</strong> Kahverengi'}</p>
                    </div>
                </div>

            </div>
            </div>
        </div>
    `;

    // --- UPDATE STICKY ACTION BAR ---
    const stickyPriceEl = document.getElementById('stickyPrice');
    if (stickyPriceEl) {
        stickyPriceEl.textContent = formatPrice(product.price);
    }

    // Bind Mobile Add Button
    window.addToCartMain = () => addToCart(product.id);
}

// --- HELPER FUNCTIONS ---

// Toggle Description
window.toggleDescription = function () {
    const moreText = document.getElementById('moreDesc');
    const btn = document.getElementById('readMoreBtn');

    if (moreText.style.display === "none") {
        moreText.style.display = "inline";
        btn.textContent = "Daha az";
    } else {
        moreText.style.display = "none";
        btn.textContent = "Daha fazlası";
    }
};

// Switch Main Image
window.switchImage = (src, thumb) => {
    const mainImg = document.getElementById('mainImage');
    mainImg.style.opacity = '0.7';
    setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
    }, 150);

    document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
};

// Format Price
function formatPrice(p) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p);
}

// Add to Cart Logic
window.addToCart = async (id) => {
    const btn = document.querySelector('.btn-add-main');
    const originalContent = btn.innerHTML;

    // Loading State
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Ekleniyor...';
    btn.disabled = true;
    btn.style.opacity = '0.8';

    // Simulate Network
    await new Promise(r => setTimeout(r, 600));

    // FETCH PRODUCT AGAIN TO ENSURE DATA
    const product = DB.getProductById(id);

    if (product && typeof Cart !== 'undefined') {
        // Fix: Use Cart.add (Capital C) and pass object
        // cart.js expects: { id, name, price, image_url... }
        Cart.add({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: (product.images && product.images[0]) ? product.images[0] : (product.image_url || ''),
            // Add other needed fields if cart.js requires them
        }, 1);

        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sepete Eklendi';
        btn.style.background = '#28a745';
        btn.style.borderColor = '#28a745';

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.background = '#003153';
        }, 2000);
    } else {
        alert('Sepet hatası: Ürün verisi okunamadı veya Cart modülü eksik.');
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
};

// Toggle Accordion (called from HTML onclick)
window.toggleAccordion = function (header) {
    const item = header.parentElement;
    item.classList.toggle('active');
};
