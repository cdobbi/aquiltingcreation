# Annotations for data/patterns.json

Purpose: Patterns used by the Design/Contact page calculator (`contact.html` and `scripts/forms.js`).

Notes (beginner voice):
- Each object is a quilting pattern with these canonical fields:
  - `id` (string) - used as the `<option>` value in the selector
  - `name` (string) - displayed in the dropdown and preview
  - `image` (string) - thumbnail path
  - `imageWidth` / `imageHeight` (number, optional) - for layout if needed
  - `description` (string) - short summary
  - `pricePerSquareInch` (number) - numeric value used by calculator

What I learned / improvements:
- Use numeric `pricePerSquareInch` for calculations to avoid parsing errors.
- If multiple consumers use the file, keep keys stable and documented (this file serves as the doc).
- Consider adding a `difficulty` or `stitchDensity` field if you want to vary pricing more accurately.

Usage:
- `scripts/forms.js` fetches this file to populate the selector, show previews, and compute estimated cost.
