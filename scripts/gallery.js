const VENMO_LINK = "https://venmo.com/"; // Replace with Christi's Venmo link if available
const VENMO_QR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(VENMO_LINK)}`;
const OWNER_EMAIL = "LongarmQuiltService@gmail.com";

let selectedItems = [];

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function generateOrderId() {
    const now = new Date();
    return `ORDER-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function setOrderSlipButtons(enabled) {
    document.getElementById('checkout-btn').disabled = !enabled;
    const headerBtn = document.getElementById('checkout-btn-header');
    if (headerBtn) headerBtn.disabled = !enabled;
}

function renderShop(items) {
    const shop = document.getElementById('shop-row');
    shop.innerHTML = '';
    items.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
    <div class="card h-100 shop-card position-relative" data-id="${item.id}">
        ${item.sold ? `<div class="sold-banner">SOLD</div>` : ""}
        <img alt="${item.name}" src="${item.image}" class="card-img-top"
            style="width:100%;max-width:400px;height:auto;object-fit:cover;" loading="lazy">
        <div class="card-body">
            <h2 class="card-title fs-5">${item.name}</h2>
            <p class="card-text">${item.description}</p>
            <p class="fw-bold">${formatPrice(item.price)}</p>
            <div class="form-check">
                <input class="form-check-input select-item" type="checkbox" value="${item.id}" id="select-${item.id}" ${item.sold ? "disabled" : ""}>
                <label class="form-check-label" for="select-${item.id}">Select</label>
            </div>
        </div>
    </div>
`;
        shop.appendChild(col);
    });

    // Card hover effect
    document.querySelectorAll('.shop-card').forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('shadow-lg', 'rise-up'));
        card.addEventListener('mouseleave', () => card.classList.remove('shadow-lg', 'rise-up'));
    });

    // Selection logic
    document.querySelectorAll('.select-item').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const id = checkbox.value;
            if (checkbox.checked) {
                if (!selectedItems.includes(id)) selectedItems.push(id);
            } else {
                selectedItems = selectedItems.filter(itemId => itemId !== id);
            }
            setOrderSlipButtons(selectedItems.length > 0);
        });
    });
}

function showOrderSlip(items) {
    const orderId = generateOrderId();
    const selected = items.filter(item => selectedItems.includes(item.id));
    let subtotal = selected.reduce((sum, item) => sum + item.price, 0);

    let slipHtml = `
    <div class="text-center mb-3">
        <span style="font-size:1.5rem;">🧵 Thank you for your order! 🪡</span>
        <p class="mt-2">Order ID: <strong>${orderId}</strong></p>
    </div>
    <div class="row">
        ${selected.map(item => `
            <div class="col-12 col-md-6 mb-3">
                <div class="border rounded p-2 h-100 d-flex flex-column align-items-center">
                    <img src="${item.image}" alt="${item.name}" style="max-width:120px;max-height:120px;">
                    <div class="fw-bold mt-2">${item.name}</div>
                    <div>${item.description}</div>
                    <div class="text-success mt-1">${formatPrice(item.price)}</div>
                </div>
            </div>
        `).join('')}
    </div>
    <div class="text-end mt-3">
        <h5>Subtotal: <span class="text-primary">${formatPrice(subtotal)}</span></h5>
    </div>
    <div class="my-3 text-center">
        <a href="https://venmo.com/leann-hill-4" target="_blank" rel="noopener">
            <img src="images/venmo.webp" alt="Venmo QR" style="width:120px;height:120px;">
        </a>
        <div class="mt-2">Scan or click to pay via Venmo.<br>
        <small>Please include your<br> Order ID <strong>${orderId}</strong> <br>in the payment note.</small></div>
    </div>
    <div class="alert alert-info mt-3">
        <p>
            Please click "Send Order Email" below to email your order slip to <a href="mailto:${OWNER_EMAIL}">${OWNER_EMAIL}</a><br>
            The shop owner will contact you to confirm your order and arrange shipping.<br>
            <strong>Do not include your address or sensitive info here.</strong>
        </p>
    </div>
`;

    document.getElementById('order-slip-content').innerHTML = slipHtml;

    // Email button logic
    document.getElementById('send-email-btn').onclick = () => {
        const subject = encodeURIComponent(`Quilt Order: ${orderId}`);
        let body = `Order ID: ${orderId}%0D%0A%0D%0A`;
        selected.forEach(item => {
            body += `${item.name} - ${formatPrice(item.price)}%0D%0A`;
        });
        body += `%0D%0ASubtotal: ${formatPrice(subtotal)}%0D%0A`;
        body += `%0D%0A(Your contact info here)%0D%0A`;
        window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
    };

    // ...inside showOrderSlip, after setting up the email button...

    document.getElementById('print-order-slip').onclick = () => {
        window.print();
    };

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('orderSlipModal'));
    modal.show();
}

fetch('data/items.json')
    .then(res => res.json())
    .then(items => {
        renderShop(items);

        // Both buttons open the order slip modal
        document.getElementById('checkout-btn').addEventListener('click', () => {
            showOrderSlip(items);
        });
        const headerBtn = document.getElementById('checkout-btn-header');
        if (headerBtn) {
            headerBtn.addEventListener('click', () => {
                showOrderSlip(items);
            });
        }
    });