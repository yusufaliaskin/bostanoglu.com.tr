/* language.js - Language Switching Logic */

const translations = {
    tr: {
        nav_home: "Ana Sayfa",
        nav_collections: "Koleksiyon",
        nav_new: "Yeni Gelenler",
        nav_contact: "İletişim",
        hero_subtitle: "Since 1985",
        hero_title: "Zerafetin <br>Yansıması",
        hero_btn: "Koleksiyonu Keşfet",
        scroll_text: "KAYDIR",
        trust_shipping_title: "Hızlı & Ücretsiz Kargo",
        trust_shipping_desc: "Tüm siparişlerde aynı gün kargo avantajı.",
        trust_payment_title: "Güvenli Ödeme",
        trust_payment_desc: "256-bit SSL koruması ile güvenli alışveriş.",
        trust_original_title: "Orijinal Ürün Garantisi",
        trust_original_desc: "Yetkili satıcı garantisiyle %100 orijinal ürünler.",
        trust_support_title: "7/24 Müşteri Desteği",
        trust_support_desc: "Her zaman yanınızdayız.",
        section_discover: "Keşfet",
        section_collections_title: "Özel Koleksiyonlar",
        col_watches: "Saatler",
        col_accessories: "Aksesuar",
        col_apparel: "Giyim",
        col_sale: "İndirim",
        col_new: "Yeni Gelenler",
        col_inspect: "İncele",
        highlight_badge: "Premium Choice",
        highlight_title: "Mükemmelliğin <br>Zamanı",
        highlight_desc: "Longines Master Collection, markanın uzmanlığını ve zerafetini gözler önüne seriyor. Geleneksel saatçilik sanatının modern tasarımla buluştuğu bu özel parça, stilinizi tamamlayacak.",
        highlight_feature_1: "Paslanmaz Çelik Kasa (42mm)",
        highlight_feature_2: "Safir Kristal Cam",
        highlight_feature_3: "Otomatik Mekanizma (72 Saat Rezerve)",
        highlight_btn: "Ürünü İncele",
        new_arrivals_sub: "Sezonun En İyileri",
        new_arrivals_title: "Yeni Gelenler",
        new_arrivals_desc: "En son koleksiyonumuzdan seçkin parçalara göz atın.",
        btn_view_all: "Tümünü Gör",
        reviews_sub: "Mutlu Müşteriler",
        reviews_title: "Kullanıcı Yorumları",
        newsletter_title: "Tarzını Keşfet",
        newsletter_desc: "Bostanoğlu Dünyasına Katılın",
        footer_desc: "Lüks ve zarafetin 1985'ten beri değişmeyen adresi. Türkiye'nin her yerine güvenli kargo.",
        footer_quick: "Hızlı Erişim",
        footer_customer: "Müşteri Hizmetleri",
        footer_faq: "Sıkça Sorulan Sorular",
        footer_return: "İade ve Değişim",
        footer_privacy: "Gizlilik Politikası",
        footer_contact: "Bize Ulaşın",
        footer_follow: "Bizi Takip Edin",
        footer_rights: "© 2026 Bostanoğlu. Tüm hakları saklıdır. Desiged for Premium Experience.",
        shop_title: "Mağaza",
        filter_all: "Tümü",
        filter_watches: "Saatler",
        filter_accessories: "Aksesuarlar",
        filter_apparel: "Giyim"
    },
    en: {
        nav_home: "Home",
        nav_collections: "Collections",
        nav_new: "New Arrivals",
        nav_contact: "Contact",
        hero_subtitle: "Since 1985",
        hero_title: "Reflection of <br>Elegance",
        hero_btn: "Discover Collection",
        scroll_text: "SCROLL",
        trust_shipping_title: "Fast & Free Shipping",
        trust_shipping_desc: "Same day shipping advantage on all orders.",
        trust_payment_title: "Secure Payment",
        trust_payment_desc: "Secure shopping with 256-bit SSL protection.",
        trust_original_title: "Original Product Guarantee",
        trust_original_desc: "100% original products with authorized dealer warranty.",
        trust_support_title: "24/7 Customer Support",
        trust_support_desc: "We are always with you.",
        section_discover: "Discover",
        section_collections_title: "Special Collections",
        col_watches: "Watches",
        col_accessories: "Accessories",
        col_apparel: "Apparel",
        col_sale: "Sale",
        col_new: "New Arrivals",
        col_inspect: "Inspect",
        highlight_badge: "Premium Choice",
        highlight_title: "Time for <br>Perfection",
        highlight_desc: "The Longines Master Collection demonstrates the brand's expertise and elegance. Where traditional watchmaking meets modern design, this special piece will complete your style.",
        highlight_feature_1: "Stainless Steel Case (42mm)",
        highlight_feature_2: "Sapphire Crystal Glass",
        highlight_feature_3: "Automatic Movement (72 Hour Reserve)",
        highlight_btn: "View Product",
        new_arrivals_sub: "Best of Season",
        new_arrivals_title: "New Arrivals",
        new_arrivals_desc: "Check out exclusive pieces from our latest collection.",
        btn_view_all: "View All",
        reviews_sub: "Happy Customers",
        reviews_title: "User Reviews",
        newsletter_title: "Discover Your Style",
        newsletter_desc: "Join the World of Bostanoğlu",
        footer_desc: "The address of luxury and elegance unchanged since 1985. Secure shipping all over Turkey.",
        footer_quick: "Quick Access",
        footer_customer: "Customer Services",
        footer_faq: "FAQ",
        footer_return: "Return & Exchange",
        footer_privacy: "Privacy Policy",
        footer_contact: "Contact Us",
        footer_follow: "Follow Us",
        footer_rights: "© 2026 Bostanoğlu. All rights reserved. Desiged for Premium Experience.",
        shop_title: "Shop",
        filter_all: "All",
        filter_watches: "Watches",
        filter_accessories: "Accessories",
        filter_apparel: "Apparel"
    },
    de: {
        nav_home: "Startseite",
        nav_collections: "Kollektionen",
        nav_new: "Neuheiten",
        nav_contact: "Kontakt",
        hero_subtitle: "Seit 1985",
        hero_title: "Reflexion der <br>Eleganz",
        hero_btn: "Kollektion Entdecken",
        scroll_text: "SCROLLEN",
        trust_shipping_title: "Schneller & Kostenloser Versand",
        trust_shipping_desc: "Versand am selben Tag für alle Bestellungen.",
        trust_payment_title: "Sichere Zahlung",
        trust_payment_desc: "Sicheres Einkaufen mit 256-Bit-SSL-Schutz.",
        trust_original_title: "Originalprodukt-Garantie",
        trust_original_desc: "100% Originalprodukte mit Garantie vom autorisierten Händler.",
        trust_support_title: "24/7 Kundensupport",
        trust_support_desc: "Wir sind immer für Sie da.",
        section_discover: "Entdecken",
        section_collections_title: "Spezielle Kollektionen",
        col_watches: "Uhren",
        col_accessories: "Accessoires",
        col_apparel: "Bekleidung",
        col_sale: "Ausverkauf",
        col_new: "Neuheiten",
        col_inspect: "Ansehen",
        highlight_badge: "Premium Wahl",
        highlight_title: "Zeit für <br>Perfektion",
        highlight_desc: "Die Longines Master Collection zeigt die Expertise und Eleganz der Marke. Wo traditionelle Uhrmacherkunst auf modernes Design trifft, vervollständigt dieses besondere Stück Ihren Stil.",
        highlight_feature_1: "Edelstahlgehäuse (42mm)",
        highlight_feature_2: "Saphirglas",
        highlight_feature_3: "Automatikwerk (72 Stunden Gangreserve)",
        highlight_btn: "Produkt Ansehen",
        new_arrivals_sub: "Das Beste der Saison",
        new_arrivals_title: "Neuheiten",
        new_arrivals_desc: "Schauen Sie sich exklusive Stücke aus unserer neuesten Kollektion an.",
        btn_view_all: "Alle Ansehen",
        reviews_sub: "Glückliche Kunden",
        reviews_title: "Kundenbewertungen",
        newsletter_title: "Entdecken Sie Ihren Stil",
        newsletter_desc: "Werden Sie Teil der Welt von Bostanoğlu",
        footer_desc: "Die Adresse für Luxus und Eleganz seit 1985 unverändert. Sicherer Versand in die ganze Türkei.",
        footer_quick: "Schnellzugriff",
        footer_customer: "Kundenservice",
        footer_faq: "FAQ",
        footer_return: "Rückgabe & Umtausch",
        footer_privacy: "Datenschutzrichtlinie",
        footer_contact: "Kontaktieren Sie uns",
        footer_follow: "Folgen Sie uns",
        footer_rights: "© 2026 Bostanoğlu. Alle Rechte vorbehalten. Desiged for Premium Experience.",
        shop_title: "Geschäft",
        filter_all: "Alle",
        filter_watches: "Uhren",
        filter_accessories: "Accessoires",
        filter_apparel: "Bekleidung"
    }
};

const LanguageManager = {
    currentLang: 'tr',

    init() {
        // Skip for Admin Page
        if (window.location.pathname.includes('admin.html')) return;

        const savedLang = localStorage.getItem('site_language');
        if (savedLang && translations[savedLang]) {
            this.setLanguage(savedLang);
        } else {
            this.setLanguage('tr'); // Default
        }

        this.bindEvents();
    },

    setLanguage(lang) {
        if (!translations[lang]) return;

        this.currentLang = lang;
        localStorage.setItem('site_language', lang);

        // Update DOM elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Handle HTML content if key implies HTML usage (e.g. <br>)
                if (key === 'hero_title' || key === 'highlight_title') {
                    el.innerHTML = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Update Active State in Switcher
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-lang') === lang) {
                opt.classList.add('active');
            }
        });

        // Update selected flag/text specific logic if needed
        const currentLangDisplay = document.getElementById('currentLangDisplay');
        if (currentLangDisplay) {
            currentLangDisplay.textContent = lang.toUpperCase();
        }
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.lang-option');
            if (target) {
                const lang = target.getAttribute('data-lang');
                this.setLanguage(lang);
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();
});
