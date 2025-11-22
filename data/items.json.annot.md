# Annotations for data/items.json

Purpose: This file contains the inventory items displayed in the shop (`gallery.html` and `scripts/gallery.js`).

Notes (beginner voice):
- Each object represents a shop item with these helpful fields:
  - `id` (string): unique identifier used in the app.
  - `name` (string): the item's display name.
  - `image` (string): path to the thumbnail image.
  - `description` (string): short description shown on the card.
  - `price` (number): price in USD used when showing subtotal and order slip.
  - `category` (string): helpful for filtering in future.
  - `sold` (boolean): if true, the item is not selectable.

What I learned / improvements:
- Keep `price` as a number for easier math (avoid strings like "$29").
- Ensure `id` values are unique — I noticed duplicate `item27` entries; fix IDs to be unique.
- If you want to support more metadata (dimensions, fabric, date made), add new keys consistently.

Usage:
- `scripts/gallery.js` fetches this file and uses `renderShop(items)` to create the UI.
