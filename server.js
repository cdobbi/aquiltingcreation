// Minimal Express server to render the gallery and accept orders
// Usage: `npm install` then `npm start` (instructions are added to README)

const express = require('express');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 8000;

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
// Minimal middleware for a beginner-friendly server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from project root so existing pages still work
app.use(express.static(path.join(__dirname)));

// Ensure data file exists and load items
const itemsPath = path.join(__dirname, 'data', 'items.json');
function loadItems() {
    try {
        const raw = fs.readFileSync(itemsPath, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('Failed to load items.json', err);
        return [];
    }
}

// Setup SQLite DB (orders)
const dbPath = path.join(__dirname, 'data', 'orders.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.prepare(
    `CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT,
    items TEXT,
    subtotal REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
).run();

// Routes
app.get('/gallery', (req, res) => {
    const items = loadItems();
    // Server-render the gallery; also provide items as a JS variable for client scripts
    res.render('gallery', { items });
});

// POST order: accept JSON payload {orderId, items, subtotal}
app.post('/order', (req, res) => {
    try {
        const { orderId, items, subtotal } = req.body;
        const stmt = db.prepare('INSERT INTO orders (order_id, items, subtotal) VALUES (?, ?, ?)');
        stmt.run(orderId || '', JSON.stringify(items || []), parseFloat(subtotal) || 0);
        res.json({ success: true, message: 'Order saved' });
    } catch (err) {
        console.error('Error saving order', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Keep existing index.html accessible at /
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Simple order confirmation page (optional redirect target)
app.get('/order-confirmation/:orderId?', (req, res) => {
    const orderId = req.params.orderId || '';
    res.render('order', { orderId });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
