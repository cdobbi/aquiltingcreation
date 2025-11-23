# A Quilting Creation — web app

Simple, beginner-friendly Node (Express) web app for a small quilting storefront.

Project requirements:

- Uses Node + Express to render server-side pages (EJS templates).
- Runs locally using the framework test server (`npm start`).
- Interactive UI: users can select items on the gallery page; selections are submitted to the server.
- Integrated database: server stores orders with SQLite (file: `data/orders.db`, using `better-sqlite3`).

## Key app pages & files

- Server: `server.js` (Express routes & DB setup)
- Views: `views/gallery.ejs`, `views/order.ejs` — server-populated pages
- Static pages: `index.html`, `contact.html` (still available)
- Client scripts: `scripts/gallery.js`, `scripts/forms.js`, `scripts/custom-captcha.js`
- Data: `data/items.json`, `data/patterns.json`
- Form handler: `submit_form.php` (kept for static/PHP testing)

## How this meets the assignment

- At least two server-rendered pages: `/gallery` (items loaded from data and rendered server-side) and `/order` (confirmation page rendered with server data).
- Interactivity: the gallery page allows item selection and submits orders via POST `/order` to the server; the server saves orders in SQLite.
- Runs locally using the provided test server (`node server.js`).

## Quick start — run locally (PowerShell)

```powershell
cd "c:\Users\UtahH\OneDrive\Desktop\aquiltingcreation"
npm install
npm start
```

Then open: http://localhost:8000/gallery

To test placing an order: select items in the gallery, click "View Order Slip", then choose "Send Order Email" (the UI uses `POST /order` to save the order).

Notes about running on Windows: this project used to use a native SQLite module (`better-sqlite3`) which sometimes needs Windows build tools. To make local testing easier, the server now falls back to a simple JSON store (`data/orders.json`) when `better-sqlite3` isn't available — so `npm install` and `npm start` should work directly inside VS Code's terminal without installing Visual Studio build tools.

---
© 2025 — A Quilting Creation

