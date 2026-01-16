/* data.js - Mock Database */

const mockProducts = [
    // SAATLER
    {
        id: "prod_001",
        name: "Longines Master Collection",
        price: 84000,
        old_price: 92000,
        category: "saat",
        brand: "Longines",
        image_url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop",
        description: "Zarafet ve ustalığın mükemmel uyumu. Otomatik mekanizma, safir cam.",
        stock: 5
    },
    {
        id: "prod_002",
        name: "Tissot Le Locle",
        price: 24500,
        old_price: null,
        category: "saat",
        brand: "Tissot",
        image_url: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=800&auto=format&fit=crop",
        description: "Klasik tasarım, modern teknoloji. İsviçre yapımı.",
        stock: 12
    },
    {
        id: "prod_003",
        name: "Casio Vintage Gold",
        price: 3200,
        old_price: 3800,
        category: "saat",
        brand: "Casio",
        image_url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop",
        description: "Retro tarzı sevenler için vazgeçilmez bir klasik.",
        stock: 20
    },

    // GIYIM (ELBISE/TSHIRT/SWEAT)
    {
        id: "prod_004",
        name: "İpek Karışımlı Midi Elbise",
        price: 4500,
        old_price: null,
        category: "elbise",
        brand: "Zara",
        image_url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
        description: "Özel günleriniz için şık ve zarif tasarım.",
        stock: 8
    },
    {
        id: "prod_005",
        name: "Premium Cotton T-Shirt",
        price: 850,
        old_price: 1200,
        category: "tshirt",
        brand: "Bostanoğlu",
        image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        description: "%100 Organik pamuk, rahat kesim.",
        stock: 50
    },
    {
        id: "prod_006",
        name: "Oversize Hoodie",
        price: 2100,
        old_price: null,
        category: "sweatshirt",
        brand: "Adidas",
        image_url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop",
        description: "Sokak modasının öncüsü, konforlu tasarım.",
        stock: 15
    },

    // AKSESUAR
    {
        id: "prod_007",
        name: "Gümüş İnci Kolye",
        price: 1800,
        old_price: 2500,
        category: "aksesuar",
        brand: "Swarovski",
        image_url: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop",
        description: "Zarif inci detaylı 925 ayar gümüş kolye.",
        stock: 10
    },
    {
        id: "prod_008",
        name: "Deri Cüzdan",
        price: 1200,
        old_price: null,
        category: "aksesuar",
        brand: "Fossil",
        image_url: "https://images.unsplash.com/photo-1627123424574-181ce5171c98?q=80&w=800&auto=format&fit=crop",
        description: "Hakiki deri, çok bölmeli kullanışlı cüzdan.",
        stock: 25
    },

    // KAHVE
    {
        id: "prod_009",
        name: "Premium Filtre Kahve (250g)",
        price: 350,
        old_price: null,
        category: "kahve",
        brand: "Bostanoğlu",
        image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop",
        description: "Özel harman, yoğun aroma.",
        stock: 100
    },
    {
        id: "prod_010",
        name: "Ethiopia Yirgacheffe",
        price: 420,
        old_price: 500,
        category: "kahve",
        brand: "Bostanoğlu",
        image_url: "https://images.unsplash.com/photo-1611854779393-1b2ae9d22cc8?q=80&w=800&auto=format&fit=crop",
        description: "Çiçeksi notalar, yumuşak içim.",
        stock: 60
    }
];

// Helper to simulate API call
window.getProducts = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const stored = localStorage.getItem('products');
            resolve(stored ? JSON.parse(stored) : mockProducts);
        }, 300); // Simulate network delay
    });
};

// Helper to get single product
window.getProductById = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const stored = localStorage.getItem('products');
            const products = stored ? JSON.parse(stored) : mockProducts;
            const product = products.find(p => p.id === id);
            resolve(product || null);
        }, 100);
    });
};

// Start Initialize if empty
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(mockProducts));
}
