/* components.js - Professional Widgets (WhatsApp & Cookie) */

document.addEventListener('DOMContentLoaded', () => {
    initWhatsAppWidget();
    initCookieConsent();
});

/* --- WHATSAPP WIDGET --- */
function initWhatsAppWidget() {
    // 1. Create Floating Button
    const waBtn = document.createElement('div');
    waBtn.className = 'wa-float-btn';
    waBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    document.body.appendChild(waBtn);

    // 2. Create Chat Box (Initially Hidden)
    const chatBox = document.createElement('div');
    chatBox.className = 'wa-chat-box';
    chatBox.innerHTML = `
        <div class="wa-header">
            <div class="wa-profile">
                <div class="wa-avatar"><i class="fa-solid fa-headset"></i></div>
                <div class="wa-info">
                    <span class="wa-name">Müşteri Hizmetleri</span>
                    <span class="wa-status">Çevrimiçi</span>
                </div>
            </div>
            <button class="wa-close"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="wa-body">
            <div class="wa-msg-bubble incoming">
                Merhaba! 👋<br>Size nasıl yardımcı olabilirim?
                <span class="wa-time">${getCurrentTime()}</span>
            </div>
        </div>
        <div class="wa-footer">
            <input type="text" id="waInput" placeholder="Mesajınızı yazın...">
            <button id="waSend"><i class="fa-regular fa-paper-plane"></i></button>
        </div>
    `;
    document.body.appendChild(chatBox);

    // 3. Logic
    let isOpen = false;

    // Toggle Chat
    waBtn.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            chatBox.classList.add('active');
            waBtn.style.display = 'none'; // Optional: hide float btn when chat open
        }
    });

    // Close Chat
    chatBox.querySelector('.wa-close').addEventListener('click', () => {
        isOpen = false;
        chatBox.classList.remove('active');
        waBtn.style.display = 'grid';
    });

    // Send Message
    const sendBtn = document.getElementById('waSend');
    const input = document.getElementById('waInput');

    function sendMessage() {
        const msg = input.value.trim();
        if (msg) {
            // PHONE NUMBER TO CONFIG (Placeholder)
            const phoneNumber = '905555555555'; // REPLACE WITH REAL NUMBER
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
            input.value = '';
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/* --- COOKIE CONSENT --- */
function initCookieConsent() {
    // Check if already accepted
    if (localStorage.getItem('cookieConsent') === 'accepted') return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
        <div class="cookie-content">
            <p>Size daha iyi bir alışveriş deneyimi sunabilmek için çerezleri kullanıyoruz. Sitemizi kullanarak çerez kullanımını kabul etmiş olursunuz.</p>
        </div>
        <div class="cookie-actions">
            <button id="acceptCookies" class="btn-cookie">Kabul Et</button>
        </div>
    `;
    document.body.appendChild(banner);

    // Fade in
    setTimeout(() => {
        banner.classList.add('visible');
    }, 1000);

    document.getElementById('acceptCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.remove('visible');
        setTimeout(() => banner.remove(), 500);
    });
}
