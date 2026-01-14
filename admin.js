/* admin.js - Auth & Logic */

// --- AUTH & INIT ---
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();

    // Login Event
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('loginUser').value;
        const p = document.getElementById('loginPass').value;

        if (u === 'bostanoglu' && p === 'admin') {
            sessionStorage.setItem('isAdmin', 'true');
            checkLogin();
        } else {
            alert('Hatalı kullanıcı adı veya şifre.');
        }
    });

    initModalLogic();
    initFileUploads();
    initSidebar();
    initThemeLogic();
});

function initThemeLogic() {
    const btn = document.getElementById('themeToggleBtn');
    const body = document.body;
    const isDark = localStorage.getItem('adminTheme') === 'dark';

    if (isDark) {
        body.classList.add('dark-mode');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i> <span>Açık Tema</span>';
    }

    if (btn) {
        btn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDarkMode = body.classList.contains('dark-mode');
            localStorage.setItem('adminTheme', isDarkMode ? 'dark' : 'light');

            btn.innerHTML = isDarkMode
                ? '<i class="fa-solid fa-sun"></i> <span>Açık Tema</span>'
                : '<i class="fa-solid fa-moon"></i> <span>Koyu Tema</span>';
        });
    }
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('sidebarToggle');
    const closeBtn = document.getElementById('closeSidebar');

    // Load persisted state (Desktop only)
    if (window.innerWidth >= 768) {
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) sidebar.classList.add('collapsed');
    }

    const toggle = () => {
        if (window.innerWidth < 768) {
            // Mobile: Toggle Active/Overlay
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        } else {
            // Desktop: Toggle Width
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        }
    };

    const closeMobile = () => {
        if (window.innerWidth < 768) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    };

    if (toggleBtn) toggleBtn.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', closeMobile);
    if (overlay) overlay.addEventListener('click', closeMobile);
}

function checkLogin() {
    const isAuth = sessionStorage.getItem('isAdmin') === 'true';
    if (isAuth) {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminLayout').style.display = 'flex';
        renderProductList(); // Render only if logged in
    } else {
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('adminLayout').style.display = 'none';
    }
}

// --- RESET ---
// --- RESET & CLEANUP ---
window.removeDefaults = () => {
    if (confirm('DİKKAT: Varsayılan (örnek) ürünler silinecek, ancak sizin eklediğiniz ürünler korunacaktır. Onaylıyor musunuz?')) {
        let products = DB.getAll();
        const BEFORE_COUNT = products.length;

        // Keep ONLY products created with new system (starting with 'prd_')
        products = products.filter(p => typeof p.id === 'string' && p.id.startsWith('prd_'));

        const AFTER_COUNT = products.length;

        DB.saveAll(products);
        renderProductList();

        const deletedCount = BEFORE_COUNT - AFTER_COUNT;
        if (deletedCount > 0) {
            alert(`${deletedCount} adet varsayılan ürün silindi.`);
        } else {
            alert('Silinecek varsayılan ürün bulunamadı.');
        }
    }
};

window.resetData = () => {
    if (confirm('DİKKAT: Tüm ürünler kalıcı olarak silinecek. Emin misiniz?')) {
        DB.clearAll();
        renderProductList();
        alert('Tüm veriler silindi.');
    }
};

window.logout = () => {
    sessionStorage.removeItem('isAdmin');
    location.reload();
};


// --- RENDER LIST ---
function renderProductList() {
    const grid = document.getElementById('adminProductList');
    grid.innerHTML = '';
    const products = DB.getAll();

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:40px;">Hiç ürün yok.</p>';
        return;
    }

    products.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.05}s`;

        let imgSrc = 'https://placehold.co/600x400?text=No+Img';
        if (p.images && p.images.length > 0) imgSrc = p.images[0];
        else if (p.image) imgSrc = p.image;

        const formattedPrice = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p.price);

        card.innerHTML = `
            <img src="${imgSrc}" class="card-img" alt="${p.name}">
            <div class="card-body">
                <div class="card-brand">${p.brand}</div>
                <h3 class="card-title">${p.name}</h3>
                <div class="card-price">${formattedPrice}</div>
            </div>
            <div class="card-actions">
                <button class="btn btn-secondary btn-sm btn-full" onclick="editProduct('${p.id}')">
                    <i class="fa-solid fa-pen"></i> Düzenle
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- CRUD ---
let currentGallery = [];

window.deleteProduct = (id) => {
    if (confirm('Silmek istediğinize emin misiniz?')) {
        DB.deleteProduct(id);
        renderProductList();
    }
};

const modal = document.getElementById('productModal');
const form = document.getElementById('productForm');

window.editProduct = (id) => {
    // ID can be string or number, DB handle it.
    const product = DB.getById(id);
    if (!product) return;
    openModal('Ürünü Düzenle', product);
};

document.getElementById('addNewBtn').addEventListener('click', () => openModal('Yeni Ürün Ekle'));

function openModal(title, data = null) {
    document.getElementById('modalTitle').textContent = title;
    modal.classList.add('active');
    form.reset();
    document.getElementById('platformsContainer').innerHTML = '';

    // Reset Gallery
    currentGallery = [];
    renderGallery();

    if (data) {
        document.getElementById('p_id').value = data.id;
        document.getElementById('p_name').value = data.name;
        document.getElementById('p_brand').value = data.brand;
        document.getElementById('p_price').value = data.price;
        document.getElementById('p_category').value = data.category;
        document.getElementById('p_desc').value = data.description;

        // Load Gallery
        if (data.images && Array.isArray(data.images)) {
            currentGallery = [...data.images];
        } else {
            if (data.image) currentGallery.push(data.image);
            if (data.hoverImage) currentGallery.push(data.hoverImage);
        }
        renderGallery();

        if (data.platforms) data.platforms.forEach(p => addPlatformRow(p.name, p.url, p.price));

        // Load Wholesale
        if (data.wholesale) {
            document.getElementById('p_wholesale_active').checked = data.wholesale.active;
            document.getElementById('p_wholesale_min').value = data.wholesale.minQty;
        } else {
            document.getElementById('p_wholesale_active').checked = false;
            document.getElementById('p_wholesale_min').value = 10;
        }

    } else {
        document.getElementById('p_id').value = '';
        addPlatformRow('Bostanoğlu', '#', '');

        // Defaults for new
        document.getElementById('p_wholesale_active').checked = false;
        document.getElementById('p_wholesale_min').value = 10;
    }
}


// --- GALLERY LOGIC ---
function initFileUploads() {
    const input = document.getElementById('p_gallery_upload');
    input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Process all files
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                compressImage(ev.target.result, (compressed) => {
                    currentGallery.push(compressed);
                    renderGallery();
                });
            };
            reader.readAsDataURL(file);
        });

        input.value = '';
    });
}

function compressImage(src, callback) {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 800;
        let scale = 1;

        if (img.width > maxWidth) scale = maxWidth / img.width;

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(dataUrl);
    };
}

function renderGallery() {
    const container = document.getElementById('galleryContainer');
    container.innerHTML = '';

    if (currentGallery.length === 0) {
        container.innerHTML = '<div class="gallery-empty-state"><span>Henüz fotoğraf eklenmedi.</span></div>';
        return;
    }

    currentGallery.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${index * 0.05}s`;

        item.innerHTML = `
            <img src="${img}" alt="img">
            <button type="button" class="remove-img-btn" onclick="removeImage(${index})">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        container.appendChild(item);
    });
}

window.removeImage = (index) => {
    currentGallery.splice(index, 1);
    renderGallery();
};


// --- PLATFORMS ---
const platformContainer = document.getElementById('platformsContainer');
document.getElementById('addPlatformBtn').addEventListener('click', () => addPlatformRow());

function addPlatformRow(name = '', url = '', price = '') {
    const row = document.createElement('div');
    row.className = 'platform-input-row';
    row.innerHTML = `
        <select class="plat-name">
            <option value="Bostanoğlu" ${name === 'Bostanoğlu' ? 'selected' : ''}>Bostanoğlu</option>
            <option value="Trendyol" ${name === 'Trendyol' ? 'selected' : ''}>Trendyol</option>
            <option value="Hepsiburada" ${name === 'Hepsiburada' ? 'selected' : ''}>Hepsiburada</option>
            <option value="N11" ${name === 'N11' ? 'selected' : ''}>N11</option>
            <option value="Amazon" ${name === 'Amazon' ? 'selected' : ''}>Amazon</option>
        </select>
        <input type="text" class="plat-url" placeholder="Link" value="${url}">
        <input type="number" class="plat-price" placeholder="Fiyat" value="${price}">
        <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">X</button>
    `;
    platformContainer.appendChild(row);
}

// --- SAVE ---
document.getElementById('saveBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const idVal = document.getElementById('p_id').value;
    const name = document.getElementById('p_name').value;
    const price = document.getElementById('p_price').value;

    if (!name || !price) return alert('İsim ve Fiyat zorunludur.');
    if (currentGallery.length === 0 && !confirm('Hiç fotoğraf eklemediniz. Devam edilsin mi?')) return;

    const platforms = [];
    document.querySelectorAll('.platform-input-row').forEach(row => {
        platforms.push({
            name: row.querySelector('.plat-name').value,
            url: row.querySelector('.plat-url').value,
            price: Number(row.querySelector('.plat-price').value) || Number(price)
        });
    });

    const productData = {
        id: idVal ? idVal : null, // Keep ID as string if exists
        name: name,
        brand: document.getElementById('p_brand').value,
        price: Number(price),
        category: document.getElementById('p_category').value,
        description: document.getElementById('p_desc').value,

        images: currentGallery,
        image: currentGallery.length > 0 ? currentGallery[0] : null,
        hoverImage: currentGallery.length > 1 ? currentGallery[1] : null,

        platforms: platforms,

        wholesale: {
            active: document.getElementById('p_wholesale_active').checked,
            minQty: Number(document.getElementById('p_wholesale_min').value) || 10
        }
    };

    DB.saveProduct(productData);
    document.getElementById('productModal').classList.remove('active');
    renderProductList();
});

function initModalLogic() {
    const close = () => document.getElementById('productModal').classList.remove('active');
    document.getElementById('closeModal').addEventListener('click', close);
    document.getElementById('cancelBtn').addEventListener('click', close);
    form.reset(); // Ensure reset
}


// --- SETTINGS LOGIC ---
const settingsModal = document.getElementById('settingsModal');

window.openSettingsModal = () => {
    settingsModal.classList.add('active');
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || {};
    document.getElementById('setting_whatsapp').value = settings.whatsapp || '905370248528';
};

window.closeSettingsModal = () => {
    settingsModal.classList.remove('active');
};

window.saveSettings = () => {
    const wa = document.getElementById('setting_whatsapp').value;
    const settings = { whatsapp: wa.replace(/\s+/g, '') }; // Remove spaces
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    alert('Ayarlar kaydedildi.');
    closeSettingsModal();
};
