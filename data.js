/* data.js - Central Product Database */

window.products = [
    {
        id: 1,
        name: "Longines Conquest Classic",
        brand: "Longines",
        price: 134000,
        category: "saat",
        image: "assets/images/mens_silver.png",
        hoverImage: "https://images.unsplash.com/photo-1622434641406-a158105c91d3?q=80&w=600&auto=format&fit=crop",
        description: "Zarafet ve performansın mükemmel uyumu. Paslanmaz çelik kasa, safir kristal cam ve 5 bar su geçirmezlik özelliği ile Longines Conquest Classic, her anınıza eşlik edecek."
    },
    {
        id: 2,
        name: "Seiko Prospex Speedtimer",
        brand: "Seiko",
        price: 32500,
        category: "saat",
        image: "https://images.unsplash.com/photo-1612817288484-92795a77a8e9?q=80&w=600&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
        description: "Profesyonel zaman tutma efsanesi geri döndü. Solar kronograf mekanizması ve dayanıklı yapısı ile Seiko Prospex, macera tutkunları için tasarlandı."
    },
    {
        id: 3,
        name: "Nike Premium Cotton Tee",
        brand: "Nike",
        price: 1200,
        category: "tshirt",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1581655353564-df123a1fb820?q=80&w=600&auto=format&fit=crop",
        description: "Yüksek kaliteli pamuklu kumaşı ve rahat kesimi ile günlük kullanım için ideal Nike T-Shirt."
    },
    {
        id: 4,
        name: "Adidas Urban Hoodie",
        brand: "Adidas",
        price: 2500,
        category: "sweatshirt",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?q=80&w=600&auto=format&fit=crop",
        description: "Şehir hayatının ritmine ayak uyduran konfor. Adidas Urban Hoodie, modern tasarımı ve sıcak tutan yapısıyla favoriniz olacak."
    },
    {
        id: 5,
        name: "Ray-Ban Hexagonal",
        brand: "Ray-Ban",
        price: 6500,
        category: "aksesuar",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=600&auto=format&fit=crop",
        description: "İkonik tasarımın modern yorumu. Altıgen çerçevesi ve kristal camları ile Ray-Ban Hexagonal, tarzınıza sofistike bir dokunuş katıyor."
    },
    {
        id: 6,
        name: "Casio Vintage Series",
        brand: "Casio",
        price: 1800,
        category: "saat",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=600&auto=format&fit=crop",
        description: "Retro tarzın vazgeçilmezi. Casio Vintage serisi, klasik dijital ekranı ve şık metal kordonu ile zamansız bir aksesuar."
    },
    {
        id: 7,
        name: "Zara Oversized Sweatshirt",
        brand: "Zara",
        price: 950,
        category: "sweatshirt",
        image: "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=600&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
        description: "Rahatlık ve stil bir arada. Zara'nın oversized kesimi ve yumuşak dokusuyla soğuk günlerin kurtarıcısı."
    },
    {
        id: 8,
        name: "Deri Bileklik Seti",
        brand: "Diğer",
        price: 450,
        category: "aksesuar",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
        description: "El yapımı gerçek deri bileklik seti. Kombinlerinizi tamamlayacak şık ve maskülen bir detay."
    }
];

// Helper to ensure data is ready (optional, but good practice)
console.log("Product Data Loaded:", window.products.length, "items");
