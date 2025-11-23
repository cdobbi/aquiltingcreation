// gallery.js
// Purpose: render the shop grid and manage order slip interactions.
// Learning notes:
// - I separate rendering from state changes when possible.
// - `selectedItems` holds the IDs of chosen items

// const is a keyword for variables that won't change.
// VENMO_LINK is a constant (fixed value) for the Venmo payment link.
// VENMO_QR builds a QR code URL using template literals (backticks for inserting variables).
// encodeURIComponent is a function (built-in) that makes strings safe for URLs.
// OWNER_EMAIL is another constant for the email address.
const VENMO_LINK = "https://venmo.com/"; // Replace with Christi's Venmo link if available
const VENMO_QR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(VENMO_LINK)}`;
const OWNER_EMAIL = "LongarmQuiltService@gmail.com";

// let is a keyword for variables that can change.
// selectedItems is an array (list) to store selected item IDs.
let selectedItems = [];

// function keyword defines a reusable block of code.
// formatPrice is a function that takes a price (parameter) and returns a formatted string.
// .toFixed is a method on numbers (formats to 2 decimal places).
function formatPrice(price) {
    // Format a number as USD. Learning note: this is simple and works for prototypes.
    return `$${price.toFixed(2)}`;
}

// generateOrderId is another function with no parameters.
// new Date() creates a date object (current time).
// .getFullYear(), etc., are methods on date objects.
// Math.floor and Math.random are functions for random numbers.
// + is the addition operator.
// .padStart is a method on strings (adds leading zeros).
function generateOrderId() {
    // Generate a short pseudo-unique order id using date + random component.
    const now = new Date();
    return `ORDER-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

// Initialize page: use server-provided window.__ITEMS__ when present,
// otherwise fetch data/items.json (static pages). This ensures both the EJS view
// and the static gallery.html populate correctly.
document.addEventListener('DOMContentLoaded', async () => {
    try {
        let items = window.__ITEMS__;
        if (!items) {
            const resp = await fetch('/data/items.json');
            if (resp.ok) items = await resp.json(); else items = [];
        }

        // Save items for other handlers, and if the shop-row is empty (static page) render items using renderShop
        galleryItems = items || [];
        const shopRow = document.getElementById('shop-row');
        if (shopRow && shopRow.children.length === 0 && Array.isArray(items)) {
            renderShop(items);
        }

        // Start with checkout buttons disabled
        setOrderSlipButtons(false);
    } catch (err) {
        console.error('Failed to initialize gallery', err);
    }
});

// setOrderSlipButtons is a function that takes enabled (boolean parameter).
// document.getElementById is a method to find HTML elements.
// .disabled is a property to enable/disable buttons.
// if statement (conditional) checks if headerBtn exists.
function setOrderSlipButtons(enabled) {
    // Enable/disable checkout buttons based on selection state.
    document.getElementById('checkout-btn').disabled = !enabled;
    const headerBtn = document.getElementById('checkout-btn-header');
    if (headerBtn) headerBtn.disabled = !enabled;
}

// renderShop is a function that takes items (array parameter).
// forEach is a method on arrays (loops over each item).
// Arrow function (=>) is a short way to write functions.
// document.createElement is a method to create new HTML elements.
// .className sets the CSS class.
// innerHTML sets the HTML content inside an element.
// Template literals use backticks for multi-line strings.
// appendChild adds the element to the parent.
// querySelectorAll finds multiple elements.
// addEventListener attaches event handlers.
// 'change' is the event type.
// Arrow function for the handler.
// if-else statements (conditionals).
// includes is a method on arrays (checks if item is in array).
// push adds to array.
// filter creates a new array without certain items.
// !== is the strict inequality operator.
// > is the greater than operator.
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

// showOrderSlip is a function that takes items (array).
// filter is a method on arrays (keeps items that match).

// Keep a global copy of items for handlers
let galleryItems = [];

function getSelectedItemObjects() {
    return selectedItems.map(id => galleryItems.find(it => String(it.id) === String(id))).filter(Boolean);
}

function calculateSubtotal(items) {
    return items.reduce((sum, it) => sum + (Number(it.price) || 0), 0);
}

function buildOrderSlipHtml(items, orderId) {
    const subtotal = calculateSubtotal(items);
    const rows = items.map(it => `<div class="d-flex justify-content-between"><div>${it.name}</div><div>${formatPrice(Number(it.price) || 0)}</div></div>`).join('\n');
    return `
        <div class="mb-2">Order ID: <strong>${orderId}</strong></div>
        <div class="order-items mb-3">${rows}</div>
        <div class="d-flex justify-content-between fw-bold"> <div>Subtotal</div><div>${formatPrice(subtotal)}</div></div>
    `;
}

async function sendOrderToServer(orderId, items, subtotal) {
    try {
        const resp = await fetch('/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, items, subtotal })
        });
        return resp.ok ? await resp.json() : null;
    } catch (err) {
        console.error('Error sending order to server', err);
        return null;
    }
}

function showOrderSlipModal() {
    const selected = getSelectedItemObjects();
    if (!selected.length) return;

    const orderId = generateOrderId();
    const subtotal = calculateSubtotal(selected);
    const content = document.getElementById('order-slip-content');
    if (content) content.innerHTML = buildOrderSlipHtml(selected, orderId);

    const modalEl = document.getElementById('orderSlipModal');
    let modalInstance = null;
    if (modalEl) {
        try {
            modalInstance = new bootstrap.Modal(modalEl);
            modalInstance.show();
        } catch (err) {
            console.warn('Bootstrap modal not available', err);
        }
    }

    const sendBtn = document.getElementById('send-email-btn');
    if (sendBtn) {
        const newBtn = sendBtn.cloneNode(true);
        sendBtn.parentNode.replaceChild(newBtn, sendBtn);
        newBtn.addEventListener('click', async () => {
            newBtn.disabled = true;
            newBtn.textContent = 'Sending...';
            const result = await sendOrderToServer(orderId, selected, subtotal);
            if (result && result.success) {
                newBtn.textContent = 'Order Saved';
                setTimeout(() => {
                    if (modalInstance) modalInstance.hide();
                    window.location.href = `/order-confirmation/${orderId}`;
                }, 700);
            } else {
                newBtn.textContent = 'Send Order Email';
                newBtn.disabled = false;
                alert('Failed to save order — check console for errors.');
            }
        });
    }
}

// Attach checkout button handler
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (window.__ITEMS__ && Array.isArray(window.__ITEMS__)) galleryItems = window.__ITEMS__;
    } catch (e) { /* ignore */ }

    if (!galleryItems.length) {
        fetch('/data/items.json').then(r => r.ok ? r.json() : []).then(data => { galleryItems = data || []; }).catch(() => { });
    }

    const checkout = document.getElementById('checkout-btn');
    if (checkout) checkout.addEventListener('click', showOrderSlipModal);
});