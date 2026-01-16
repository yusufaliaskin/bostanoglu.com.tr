/* auth.js - Global Authentication Logic */

document.addEventListener('DOMContentLoaded', () => {
    initAuthUI();
});

async function initAuthUI() {
    const userBtn = document.querySelector('.fa-user').parentElement;
    if (!userBtn) return;

    // Check Supabase Session
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
        // Logged In -> Go to Account Page
        userBtn.href = 'account.html';
        userBtn.title = 'Hesabım';
    } else {
        // Logged Out -> Go to Login Page
        userBtn.href = 'login.html';
        userBtn.title = 'Giriş Yap / Kayıt Ol';
    }

    // Listen for auth state changes (e.g. if logout happens in another tab)
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            userBtn.href = 'account.html';
        } else {
            userBtn.href = 'login.html';
        }
    });
}

// Favorites Logic (Local Only for now, consistent with previous scope unless user asks for cloud favorites)
window.toggleFavorite = function (productId, btn) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(productId);

    if (index === -1) {
        favorites.push(productId);
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        btn.classList.add('active'); // Optional styling
    } else {
        favorites.splice(index, 1);
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        btn.classList.remove('active');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Dispatch event to update other components if needed
    window.dispatchEvent(new CustomEvent('favorites-updated'));
};

window.checkFavorite = function (productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(productId);
};
