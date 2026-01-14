# Bostanoğlu | Premium E-Ticaret Arayüzü

**Bostanoğlu**, lüks saat, giyim ve aksesuar ürünleri için tasarlanmış, modern, tam responsive (mobil uyumlu) ve kullanıcı deneyimi odaklı bir front-end e-ticaret projesidir.

Bu proje, "Mobile First" (Önce Mobil) yaklaşımıyla tasarlanmış olup, gelişmiş filtreleme sistemleri, dinamik ürün detay sayfaları ve şık animasyonlar içerir.

## 🌟 Özellikler

*   **Tam Responsive Tasarım:** Mobil, tablet ve masaüstü cihazlarda kusursuz görünüm.
*   **Dinamik Ürün Yönetimi:** Tüm ürün verileri merkezi bir `data.js` dosyasından yönetilir.
*   **Gelişmiş Filtreleme (Collections):**
    *   Kategori, Marka, Fiyat ve Akıllı Sıralama seçenekleri.
    *   **Mobil Özel:** Yer tasarrufu sağlayan, animasyonlu "Sidebar Drawer" filtre menüsü.
*   **Ürün Detay Sayfası (Shop):**
    *   URL parametreleri (`?id=x`) ile dinamik içerik yükleme.
    *   Otomatik "Benzer Ürünler" önerisi.
    *   Platform fiyat karşılaştırma simülasyonu.
*   **Modern UI/UX:**
    *   Glassmorphism (Buzlu Cam) efektli Navbar.
    *   Sinematik "Scroll Reveal" ve giriş animasyonları.
    *   Özel tasarım WhatsApp iletişim widget'ı.
    *   Lüks hissiyat veren tipografi ve renk paleti.

## 🛠️ Teknolojiler

Bu proje saf (Vanilla) web teknolojileri ile geliştirilmiştir, harici bir framework bağımlılığı yoktur.

*   **HTML5:** Semantik yapı.
*   **CSS3:** Modern Flexbox & Grid, CSS Variables, Backdrop Filter, Keyframe Animasyonları.
*   **JavaScript (ES6+):** DOM manipülasyonu, URLSearchParams, LocalStorage (simüle edilmiş sepet/favori mantığı için altyapı).
*   **Font Awesome:** İkon setleri.
*   **Google Fonts:** Italiana (Başlıklar) & Jost (Gövde metni).

## 📂 Proje Yapısı

```
bostanoglu.com.tr/
│
├── index.html          # Ana Sayfa (Vitrin, Hero Slider, Öne Çıkanlar)
├── collections.html    # Ürün Listeleme & Filtreleme Sayfası
├── shop.html           # Ürün Detay Sayfası
│
├── assets/             # Görseller ve medya dosyaları
│
├── css/
│   ├── global.css      # Tüm siteyi etkileyen ortak stiller (Header, Footer, Reset)
│   ├── index.css       # Ana sayfaya özel stiller
│   ├── collections.css # Filtreleme ve liste görünümü stilleri
│   └── shop.css        # Ürün detay sayfası stilleri
│
└── js/
    ├── data.js         # Tüm ürün veritabanı (JSON formatında obje dizisi)
    ├── components.js   # Ortak bileşenler (WhatsApp widget vb.)
    ├── index.js        # Ana sayfa mantığı
    ├── collections.js  # Filtreleme ve sıralama mantığı
    └── shop.js         # Ürün detay ve URL parametre işleme mantığı
```

## 🚀 Kurulum ve Çalıştırma

Bu bir statik web projesidir. Herhangi bir sunucu kurulumu gerektirmez.

1.  Projeyi bilgisayarınıza indirin veya klonlayın.
2.  `index.html` dosyasına çift tıklayarak tarayıcınızda açın.
3.  Veya VS Code kullanıyorsanız "Live Server" eklentisi ile `Go Live` diyerek çalıştırabilirsiniz.

## 🎨 Renk Paleti

*   **Ana Arka Plan:** `#ffffff` (Beyaz)
*   **Metin Rengi:** `#121212` (Koyu Siyah)
*   **Vurgu Rengi (Gold):** `#c4a661` (Lüks Altın)
*   **İkincil Metin:** `#666666` (Gri)

## 📱 Mobil Deneyim

Mobil cihazlarda menü ve filtreler, kullanıcı dostu "Off-Canvas" (ekran dışı panel) yapısında çalışır. Navbar scroll edildiğinde veya beyaz zeminli sayfalarda otomatik olarak "Dark Mode" stiline geçerek okunabilirliği korur.

---
*Github için hazırlanmıştır.*
