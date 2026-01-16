/* admin.js - Local Admin Panel Logic */

// Use local DB if db.js exposes one, or build simple wrappers here.
// Assuming db.js might be gone or simple, I'll implement direct localStorage wrappers here for clarity and safety.
// Mock "DB" helpers
// DB is now loaded from db.js

document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    initTheme();
    initSidebar();

    // View Toggles
    const navProducts = document.getElementById('navProducts');
    const navOrders = document.getElementById('navOrders');
    const navCategories = document.getElementById('navCategories'); // NEW
    const navCoupons = document.getElementById('navCoupons'); // NEW

    if (navProducts) navProducts.addEventListener('click', (e) => switchView(e, 'products'));
    if (navOrders) navOrders.addEventListener('click', (e) => switchView(e, 'orders'));
    if (navCategories) navCategories.addEventListener('click', (e) => switchView(e, 'categories'));
    if (navCoupons) navCoupons.addEventListener('click', (e) => switchView(e, 'coupons')); // NEW
});

// --- AUTHENTICATION ---
function checkLogin() {
    const isAuth = sessionStorage.getItem('isAdmin') === 'true';
    if (isAuth) {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminLayout').style.display = 'flex';
        renderProductList(); // Default View
    } else {
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('adminLayout').style.display = 'none';
    }
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('loginUser').value;
    const p = document.getElementById('loginPass').value;

    if (u === 'bostanoglu' && p === 'admin') {
        sessionStorage.setItem('isAdmin', 'true');
        checkLogin();
        e.target.reset();
    } else {
        alert('Hatalı kullanıcı adı veya şifre!');
    }
});

function logout() {
    if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
        sessionStorage.removeItem('isAdmin');
        window.location.reload();
    }
}


// --- VIEW SWITCHING ---
function switchView(e, viewName) {
    if (e) e.preventDefault();

    // Active State
    document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
    if (viewName === 'products') document.getElementById('navProducts').classList.add('active');
    if (viewName === 'orders') document.getElementById('navOrders').classList.add('active');
    if (viewName === 'categories') document.getElementById('navCategories').classList.add('active');

    // Title
    const titleEl = document.querySelector('.top-bar-left h1');
    const addBtn = document.getElementById('addNewBtn');

    // Hide all first
    const prodList = document.getElementById('adminProductList');
    const orderList = document.getElementById('adminOrderList');
    const catList = document.getElementById('adminCategoryList');
    const cpnList = document.getElementById('adminCouponList');

    if (prodList) prodList.style.display = 'none';
    if (orderList) orderList.style.display = 'none';
    if (catList) catList.style.display = 'none';
    if (cpnList) cpnList.style.display = 'none';

    if (viewName === 'products') {
        prodList.style.display = 'grid';
        titleEl.textContent = 'Ürün Yönetimi';
        addBtn.style.display = 'flex';
        renderProductList();
    } else if (viewName === 'orders') {
        orderList.style.display = 'flex';
        titleEl.textContent = 'Sipariş Yönetimi';
        addBtn.style.display = 'none';
        renderOrderList();
    } else if (viewName === 'categories') {
        catList.style.display = 'block';
        titleEl.textContent = 'Kategori Yönetimi';
        addBtn.style.display = 'none';
        renderCategoryList();
    } else if (viewName === 'coupons') {
        cpnList.style.display = 'block';
        titleEl.textContent = 'Kupon Yönetimi';
        addBtn.style.display = 'none';
        renderCouponList();
    }
}


// --- THEME & SIDEBAR ---
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('themeToggleBtn');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i> <span>Açık Tema</span>';
    }

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            toggleBtn.innerHTML = isDark
                ? '<i class="fa-solid fa-sun"></i> <span>Açık Tema</span>'
                : '<i class="fa-solid fa-moon"></i> <span>Koyu Tema</span>';
        });
    }
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggle = document.getElementById('sidebarToggle');
    const close = document.getElementById('closeSidebar');

    function toggleSidebar() {
        if (window.innerWidth > 1024) {
            // Desktop: Collapse
            sidebar.classList.toggle('collapsed');
        } else {
            // Mobile: Overlay
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }

    function closeSidebarMobile() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    if (toggle) toggle.addEventListener('click', toggleSidebar);
    if (close) close.addEventListener('click', closeSidebarMobile);
    if (overlay) overlay.addEventListener('click', closeSidebarMobile);
}


// --- PRODUCT MANAGEMENT (LOCAL) ---
async function renderProductList() {
    const grid = document.getElementById('adminProductList');
    if (!grid) return;

    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Yükleniyor...</div>';

    // Simulate Delay
    await new Promise(r => setTimeout(r, 200));

    const products = DB.getProducts();

    grid.innerHTML = '';

    if (!products || products.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;">Ürün bulunamadı.</div>';
        return;
    }

    products.forEach(p => {
        let imgSrc = p.image_url;
        if (!imgSrc && p.images && p.images.length > 0) imgSrc = p.images[0];
        if (!imgSrc) imgSrc = 'https://placehold.co/100';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${imgSrc}" alt="${p.name}">
            <div class="card-body">
                <span class="card-brand">${p.brand || 'Bostanoğlu'}</span>
                <h4 class="card-title">${p.name}</h4>
                <div class="row" style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="card-price">${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p.price)}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-outline" onclick="editProduct('${p.id}')"><i class="fa-solid fa-pen"></i> Düzenle</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct('${p.id}')"><i class="fa-solid fa-trash"></i> Sil</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Modal & Form Logic
const modal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
let editingId = null;
let currentGalleryFiles = [];
let existingGalleryUrls = [];

// Mock upload logic (stores as Base64 for local demo or assumes direct URL input would be better, but we'll try FileReader)
async function uploadFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

// Populate Category Dropdown Helper
function populateCategoryDropdown() {
    const select = document.getElementById('p_category');
    if (!select) return;

    // Clear and Popualte
    const cats = DB.getCategories();
    select.innerHTML = '';

    if (cats.length > 0) {
        select.innerHTML = cats.map(c => `<option value="${c.slug}">${c.name}</option>`).join('');
    } else {
        select.innerHTML = '<option value="">Kategori Yok</option>';
    }
}

// Add New
document.getElementById('addNewBtn').addEventListener('click', () => {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Yeni Ürün Ekle';
    productForm.reset();
    resetGalleryPreview();
    populateCategoryDropdown(); // Load dynamic categories
    modal.classList.add('active');
});

// Close Modal
document.getElementById('closeModal').addEventListener('click', () => {
    modal.classList.remove('active');
});

// Edit Product
window.editProduct = (id) => {
    try {
        editingId = id;
        document.getElementById('modalTitle').textContent = 'Ürün Düzenle';

        const p = DB.getProductById(id);

        if (!p) {
            alert('Ürün bulunamadı.');
            return;
        }

        populateCategoryDropdown(); // Load dynamic categories before setting value

        modal.classList.add('active');

        // Populate inputs
        if (document.getElementById('p_name')) document.getElementById('p_name').value = p.name;
        if (document.getElementById('p_brand')) document.getElementById('p_brand').value = p.brand || '';
        if (document.getElementById('p_price')) document.getElementById('p_price').value = p.price;
        if (document.getElementById('p_desc')) document.getElementById('p_desc').value = p.description || '';

        // Populate Category
        if (document.getElementById('p_category')) {
            // If the category exists in the list, fine. If not (was deleted), it matches nothing (browser defaults to first).
            // Ideally we check if value exists, but simple assignment works for now.
            document.getElementById('p_category').value = p.category || '';
        }

        // Images
        resetGalleryPreview();
        existingGalleryUrls = [];

        let images = [];
        if (p.images && Array.isArray(p.images) && p.images.length > 0) images = p.images;
        else if (p.image_url) images = [p.image_url];

        renderPreview(images, true);

        // Populate Specs
        if (p.specs) {
            document.getElementById('p_spec_case').value = p.specs.case || '';
            document.getElementById('p_spec_dial').value = p.specs.dial || '';
            document.getElementById('p_spec_movement').value = p.specs.movement || '';
            document.getElementById('p_spec_strap').value = p.specs.strap || '';
        } else {
            // Clear if no specs
            ['p_spec_case', 'p_spec_dial', 'p_spec_movement', 'p_spec_strap'].forEach(id => document.getElementById(id).value = '');
        }
        checkSpecsVisibility();
    } catch (e) {
        console.error('Edit error:', e);
        alert('Ürün yüklenirken hata oluştu: ' + e.message);
    }
};

// Toggle Specs Logic
const catSelect = document.getElementById('p_category');
function checkSpecsVisibility() {
    const section = document.getElementById('watchSpecsSection');
    // Check if selected category is 'saat' (watch)
    if (catSelect && catSelect.value === 'saat') {
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
    }
}
if (catSelect) catSelect.addEventListener('change', checkSpecsVisibility);

// Gallery Logic
const galleryInput = document.getElementById('p_gallery_upload');
const galleryPreview = document.getElementById('galleryContainer');

if (galleryInput) {
    galleryInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        currentGalleryFiles = [...currentGalleryFiles, ...files];
        const newUrls = files.map(file => URL.createObjectURL(file));
        renderPreview(newUrls, false);
    });
}

function resetGalleryPreview() {
    if (galleryPreview) galleryPreview.innerHTML = '<div class="gallery-empty-state"><span>Henüz fotoğraf eklenmedi.</span></div>';
    currentGalleryFiles = [];
    existingGalleryUrls = [];
}

function renderPreview(urls, isExisting) {
    if (!galleryPreview) return;

    // Clear empty state if adding
    if (galleryPreview.querySelector('.gallery-empty-state')) galleryPreview.innerHTML = '';

    urls.forEach((url) => {
        if (isExisting) existingGalleryUrls.push(url);

        const div = document.createElement('div');
        div.className = 'g-item';
        div.style.cssText = 'position:relative; width:80px; height:80px; display:inline-block; margin:5px;';
        div.innerHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;"><button type="button" class="remove-img" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer;">&times;</button>`;

        div.querySelector('.remove-img').onclick = () => {
            div.remove();
            if (isExisting) {
                existingGalleryUrls = existingGalleryUrls.filter(u => u !== url);
            }
        };
        galleryPreview.appendChild(div);
    });
}

// SAVE
document.getElementById('saveBtn').addEventListener('click', async (e) => {
    const btn = e.target;
    const nameInput = document.getElementById('p_name');
    const priceInput = document.getElementById('p_price');
    const catInput = document.getElementById('p_category');

    if (!nameInput || !priceInput || !nameInput.value || !priceInput.value) {
        alert('Lütfen zorunlu alanları doldurun.');
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> İşleniyor...';
    btn.disabled = true;

    try {
        // 1. Upload New Images (to base64 for local)
        let uploadedUrls = [];
        if (currentGalleryFiles.length > 0) {
            for (const file of currentGalleryFiles) {
                // Size Check (800KB limit for LocalStorage safety)
                if (file.size > 800 * 1024) {
                    alert(`"${file.name}" çok büyük. Lütfen 800KB'dan küçük görseller yükleyin.\n(Tarayıcı hafızası sınırlıdır.)`);
                    throw new Error('File too large');
                }
                const url = await uploadFile(file);
                uploadedUrls.push(url);
            }
        }

        // Combine
        const finalImages = [...existingGalleryUrls, ...uploadedUrls];
        const mainImageUrl = finalImages.length > 0 ? finalImages[0] : '';
        const brandVal = document.getElementById('p_brand') ? document.getElementById('p_brand').value : '';
        const descVal = document.getElementById('p_desc') ? document.getElementById('p_desc').value : '';
        const categoryVal = catInput ? catInput.value : 'saat';

        // Collect Specs
        const specs = {
            case: document.getElementById('p_spec_case').value,
            dial: document.getElementById('p_spec_dial').value,
            movement: document.getElementById('p_spec_movement').value,
            strap: document.getElementById('p_spec_strap').value
        };

        const productData = {
            id: editingId,
            name: nameInput.value,
            brand: brandVal,
            price: parseFloat(priceInput.value),
            description: descVal,
            category: categoryVal,
            image_url: mainImageUrl,
            images: finalImages,
            specs: specs // Save specs structure
        };

        DB.saveProduct(productData);

        resetGalleryPreview();
        modal.classList.remove('active');
        renderProductList();
        alert('İşlem başarılı!');

    } catch (err) {
        console.error('Save error:', err);
        alert('Bir hata oluştu: ' + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

// DELETE
window.deleteProduct = (id) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    DB.deleteProduct(id);
    renderProductList();
};


// --- ORDERS MANAGEMENT (LOCAL) ---
async function renderOrderList() {
    const list = document.getElementById('adminOrderList');
    if (!list) return;

    list.innerHTML = '<div style="text-align:center;">Siparişler yükleniyor...</div>';
    await new Promise(r => setTimeout(r, 200));

    const orders = DB.getOrders();

    list.innerHTML = '';

    if (!orders || orders.length === 0) {
        list.innerHTML = '<p class="empty-state">Henüz hiç sipariş yok.</p>';
        return;
    }

    orders.forEach(order => {
        const date = new Date(order.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
        const total = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.total_price);

        let statusClass = 'status-pending';
        if (order.order_status === 'teslim_edildi') statusClass = 'status-completed';
        if (order.order_status === 'iptal') statusClass = 'status-cancelled';

        // Items Summary
        let itemsHtml = '';
        if (order.items && order.items.length > 0) {
            itemsHtml = `<table class="order-items-table">
                <thead><tr><th>Ürün</th><th>Adet</th><th>Fiyat</th></tr></thead>
                <tbody>
                    ${order.items.map(i => `
                        <tr>
                            <td>${i.name}</td>
                            <td>${i.qty}</td>
                            <td>${i.price} ₺</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>`;
        }

        const div = document.createElement('div');
        div.className = `order-card ${statusClass}`;
        div.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">#${order.id}</div>
                    <div class="order-date">${date}</div>
                </div>
                <div class="order-total">${total}</div>
            </div>
            
            <div class="order-customer">
                <strong>${order.customer_name}</strong>
            </div>
            <div class="order-meta">
                ${order.city} / ${order.district}<br>
                ${order.phone}
            </div>

            <div class="order-details-toggle" style="margin-top:10px; cursor:pointer; color:#0d6efd;" onclick="this.nextElementSibling.style.display = 'block'; this.style.display='none';">
                <i class="fa-solid fa-chevron-down"></i> Detayları Göster
            </div>
            <div class="order-full-details" style="display:none;">
                <p style="font-size:0.9rem; margin-top:10px;"><strong>Adres:</strong> ${order.address}</p>
                ${itemsHtml}
                
                <div class="order-actions">
                    <select class="form-control" style="width:auto;" onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="hazirlaniyor" ${order.order_status === 'hazirlaniyor' ? 'selected' : ''}>Hazırlanıyor</option>
                        <option value="kargoda" ${order.order_status === 'kargoda' ? 'selected' : ''}>Kargoda</option>
                        <option value="teslim_edildi" ${order.order_status === 'teslim_edildi' ? 'selected' : ''}>Teslim Edildi</option>
                        <option value="iptal" ${order.order_status === 'iptal' ? 'selected' : ''}>İptal</option>
                    </select>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
}

window.updateOrderStatus = (orderId, newStatus) => {
    if (!confirm('Sipariş durumunu güncellemek istediğinize emin misiniz?')) return;
    DB.updateOrder(orderId, newStatus);
    alert('Sipariş durumu güncellendi.');
    renderOrderList();
};

window.openSettingsModal = () => {
    alert('Ayarlar modülü henüz aktif değil.');
};

// --- CATEGORY MANAGEMENT ---
window.renderCategoryList = () => {
    const listUl = document.getElementById('categoryListUl');
    if (!listUl) return;

    const cats = DB.getCategories();
    if (cats.length === 0) {
        listUl.innerHTML = '<li style="color:#888;">Hiç kategori yok.</li>';
        return;
    }

    listUl.innerHTML = cats.map(c => {
        const isProtected = ['saat', 'elbise', 'taki', 'kahve'].includes(c.slug);
        return `
        <li style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid var(--border);">
            <div>
                <strong>${c.name}</strong> 
                <span style="font-size:0.8rem; color:#888; margin-left:10px;">(${c.slug})</span>
            </div>
            ${isProtected
                ? '<span style="color:#aaa; font-size:0.9rem;"><i class="fa-solid fa-lock"></i> Kilitli</span>'
                : `<button class="btn btn-sm btn-danger" onclick="deleteCategory('${c.id}')"><i class="fa-solid fa-trash"></i></button>`
            }
        </li>
    `}).join('');
};

window.handleAddCategory = () => {
    const nameInput = document.getElementById('newCatName');
    const slugInput = document.getElementById('newCatSlug');

    if (!nameInput.value || !slugInput.value) {
        alert('Lütfen ad ve slug giriniz.');
        return;
    }

    DB.saveCategory({
        name: nameInput.value,
        slug: slugInput.value
    });

    nameInput.value = '';
    slugInput.value = '';
    renderCategoryList();
    alert('Kategori eklendi.');
};

window.deleteCategory = (id) => {
    if (!confirm('Kategoriyi silmek istediğinize emin misiniz?')) return;
    DB.deleteCategory(id);
    renderCategoryList();
};

// Auto Slug
document.getElementById('newCatName')?.addEventListener('input', (e) => {
    const slug = e.target.value.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    if (document.getElementById('newCatSlug')) {
        document.getElementById('newCatSlug').value = slug;
    }
});

// --- COUPON MANAGEMENT ---
window.renderCouponList = () => {
    const listBody = document.getElementById('couponListTable');
    if (!listBody) return;

    const coupons = DB.getCoupons();
    if (coupons.length === 0) {
        listBody.innerHTML = '<tr><td colspan="3" style="padding:20px; text-align:center; color:#888;">Henüz kupon yok.</td></tr>';
        return;
    }

    listBody.innerHTML = coupons.map(c => `
        <tr style="border-bottom:1px solid var(--border);">
            <td style="padding:10px;"><strong>${c.code}</strong></td>
            <td style="padding:10px;">${c.type === 'percentage' ? '%' + c.value : c.value + ' TL'}</td>
            <td style="padding:10px;">
                <button class="btn btn-sm btn-danger" onclick="deleteCoupon('${c.id}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
};

window.handleAddCoupon = () => {
    const codeInp = document.getElementById('newCpnCode');
    const typeInp = document.getElementById('newCpnType');
    const valInp = document.getElementById('newCpnValue');

    if (!codeInp.value || !valInp.value) {
        alert('Kupon kodu ve değerini giriniz.');
        return;
    }

    DB.saveCoupon({
        code: codeInp.value.toUpperCase().trim(),
        type: typeInp.value,
        value: parseFloat(valInp.value)
    });

    codeInp.value = '';
    valInp.value = '';
    renderCouponList();
    alert('Kupon başarıyla eklendi.');
};

window.deleteCoupon = (id) => {
    if (!confirm('Kuponu silmek istediğinize emin misiniz?')) return;
    DB.deleteCoupon(id);
    renderCouponList();
};
