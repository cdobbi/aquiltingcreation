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

## Quick start — run locally (VS Code terminal)

Open the project folder in VS Code and use the integrated terminal (Terminal → New Terminal). These commands work in PowerShell inside VS Code:

```powershell
cd "c:\Users\UtahH\OneDrive\Desktop\aquiltingcreation"
# (optional cleanup if a previous install failed)
Remove-Item node_modules,package-lock.json -Recurse -Force -ErrorAction SilentlyContinue
npm install
npm start
```

Then open http://localhost:8000/gallery in your browser.

How to verify the app (quick):

- On `/gallery` select one or more items → View Order Slip → Send Order Email
- Confirm persistence:
	- If `better-sqlite3` was installed on your machine, orders are saved to `data/orders.db` (SQLite).
	- Otherwise the app uses a JSON fallback and appends orders to `data/orders.json` (this ensures the app runs in VS Code without Visual Studio build tools).

---
© 2025 — A Quilting Creation

