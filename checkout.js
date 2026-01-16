/* checkout.js - Checkout Logic */

let appliedDiscount = 0;
let appliedCouponCode = null;

document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
});

function initCheckout() {
    renderOrderSummary();

    const payBtn = document.getElementById('payBtn');
    if (payBtn) payBtn.addEventListener('click', handlePayment);

    // Coupon Listener
    const cpnBtn = document.getElementById('applyCouponBtn');
    if (cpnBtn) cpnBtn.addEventListener('click', handleCoupon);
}

function renderOrderSummary() {
    const items = Cart.getItems();
    const container = document.getElementById('orderItemsList');
    const totalEl = document.getElementById('finalTotal');

    if (items.length === 0) {
        container.innerHTML = '<p>Sepetiniz boş.</p>';
        totalEl.textContent = '0.00 TL';
        if (document.getElementById('payBtn')) document.getElementById('payBtn').disabled = true;
        return;
    }

    container.innerHTML = '';
    let total = 0;

    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
            <img src="${item.image || 'https://placehold.co/100'}" alt="img">
            <div class="summary-info">
                <h4>${item.name}</h4>
                <div style="font-size:0.85rem; color:#666;">${item.quantity} Adet</div>
                <div style="font-weight:600;">${formatPrice(itemTotal)}</div>
            </div>
        `;
        container.appendChild(div);
    });

    // Recalculate with Discount
    const final = Math.max(0, total - appliedDiscount);

    // Display Logic
    if (appliedDiscount > 0) {
        totalEl.innerHTML = `
            <span style="text-decoration:line-through; color:#999; font-size:0.9rem; margin-right:10px;">${formatPrice(total)}</span>
            <span style="color:#28a745;">${formatPrice(final)}</span>
        `;
    } else {
        totalEl.textContent = formatPrice(final);
    }
}

function handleCoupon() {
    const input = document.getElementById('couponCode');
    const msg = document.getElementById('couponMessage');
    const code = input.value.trim().toUpperCase();

    if (!code) return;

    // DB from db.js
    const coupons = DB.getCoupons();
    const coupon = coupons.find(c => c.code === code);

    // Calculate Cart Total
    const items = Cart.getItems();
    const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    if (coupon) {
        // Apply
        let discount = 0;
        if (coupon.type === 'percentage') {
            discount = subtotal * (coupon.value / 100);
        } else {
            discount = coupon.value;
        }

        // Cap discount at subtotal
        if (discount > subtotal) discount = subtotal;

        appliedDiscount = discount;
        appliedCouponCode = coupon.code;

        msg.style.color = 'green';
        msg.innerHTML = `<i class="fa-solid fa-check"></i> <strong>${coupon.code}</strong> uygulandı!`;
        renderOrderSummary(); // Re-render to show new total
    } else {
        msg.style.color = 'red';
        msg.textContent = 'Geçersiz kupon kodu.';
        appliedDiscount = 0;
        appliedCouponCode = null;
        renderOrderSummary();
    }
}

async function handlePayment() {
    // 1. Validate Form
    const form = document.getElementById('checkoutForm');
    if (!form.reportValidity()) return;

    const payBtn = document.getElementById('payBtn');
    const originalText = payBtn.innerHTML;

    // 2. Mock Payment Process
    payBtn.disabled = true;
    payBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Ödeme İşleniyor...';

    // Simulate Network Delay (Iyzico Handshake)
    await new Promise(r => setTimeout(r, 2000));

    try {
        // 3. Create Order Data
        const items = Cart.getItems();
        const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const finalTotal = Math.max(0, subtotal - appliedDiscount);

        const customer = {
            name: document.getElementById('fname').value + ' ' + document.getElementById('lname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            district: document.getElementById('district').value
        };

        // 3.5 Check Auth
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user ? user.id : null;

        // 4. Insert into Supabase (Orders)
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: userId, // Link to user
                customer_name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                district: customer.district,
                total_price: finalTotal, // USE DISCOUNTED TOTAL
                payment_status: 'paid', // Simulated success
                order_status: 'hazirlaniyor'
                // Note: We aren't storing the coupon code/discount amount in DB columns as per user request just to "make it work".
                // Ideally we would add 'coupon_code' and 'discount_amount' columns.
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // 5. Insert Items (Order Items)
        const orderItems = items.map(item => ({
            order_id: orderData.id,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        // 6. Success & Clear Cart
        Cart.clear();
        payBtn.innerHTML = '<i class="fa-solid fa-check"></i> Sipariş Alındı!';
        payBtn.style.background = '#28a745';

        alert(`Siparişiniz başarıyla oluşturuldu! \nÖdenen Tutar: ${formatPrice(finalTotal)}`);
        window.location.href = 'index.html';

    } catch (err) {
        console.error('Order Error:', err);
        alert('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
        payBtn.disabled = false;
        payBtn.innerHTML = originalText;
    }
}

function formatPrice(amount) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
}
