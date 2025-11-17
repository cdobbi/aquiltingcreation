# 🧵 A Quilting Creation 🪡

Welcome to **A Quilting Creation** — a website for the longarm sewing business by Christi Dobbins!  
Here, quilting dreams are stitched into reality, one patch at a time.

![Quilting Machine](images/blue-machine.webp)

---

## ✨ Features

- 🖼️ **Gallery:** Explore beautiful quilt designs and finished projects.
- 📝 **Custom Design Form:** Submit your own quilt ideas and preferences.
- 📅 **Inquiry Tracking:** Review your submitted requests and details.
- 📱 **Responsive Design:** Looks great on any device.
- 🔒 **Secure Contact:** Google reCAPTCHA keeps your submissions safe.

---

## 🚀 Getting Started

1. **Clone or Download** this repository.
2. Open `index.html` in your browser to explore the site.
3. To submit a custom quilt request, use the **Design** form.
4. All styles and scripts are in the `styles/` and `scripts/` folders.

---

## 🛠️ Tech Stack

- HTML5, CSS3 (with Bootstrap 5)
- JavaScript (vanilla)
- PHP (for form handling)
- Google reCAPTCHA

---

## 📸 Gallery Preview

![Sample Quilt](images/zstar.webp)
![Sample Quilt](images/zzzz.webp)

---

## 📬 Contact

- Email: [Christina.Dobbina@gmail.com](mailto:Christina.Dobbina@gmail.com)
- Phone: 385-895-6068

---

> _Stitches of love, patches of dreams, quilts tell stories through fabric seams._

---

© 2025 Christi Dobbins | A Quilting Creation
 
---

## 📦 Patterns schema (data/patterns.json)

This project uses `data/patterns.json` to populate the pattern selector on the Design/Contact page.
The canonical fields are listed below — keep these fields and types consistent when adding or editing patterns:

- `id` (string) - unique identifier used in the HTML <option> value
- `name` (string) - visible name in the dropdown and descriptions
- `image` (string) - path to the thumbnail image (e.g. `images/thumb1.webp`)
- `imageWidth` (number, optional) - thumbnail width (px)
- `imageHeight` (number, optional) - thumbnail height (px)
- `description` (string) - short description for the pattern
- `pricePerSquareInch` (number) - canonical price per square inch for calculator (e.g., `0.020`)

Example entry:
```json
{
	"id": "pattern1",
	"name": "Daisy Delight",
	"image": "images/thumb1.webp",
	"imageWidth": 44,
	"imageHeight": 44,
	"description": "Charming daisies and leaves.",
	"pricePerSquareInch": 0.020
}
```

### Contributing / Adding a new pattern

1. Add a new JSON object to `data/patterns.json`, following the schema above.
2. Keep `pricePerSquareInch` as a number (not a string). Use 3 decimal places where appropriate (e.g. `0.020`).
3. Use a relative path for `image` (e.g. `images/thumb16.webp`).
4. If fields are missing, the form script will warn in the browser console — fix the data to remove warnings.

### Validator (Recommended)

Automated validation is considered a good development practice for projects that have structured data files (like `patterns.json`) and multiple contributors. A simple validator will:

- Catch typos and missing keys early (e.g., a missing `pricePerSquareInch`).
- Prevent UI bugs caused by inconsistent property names.
- Be integrated into CI to reject pull requests with schema errors.

You don't strictly need a validator for a single-person project, but it reduces accidental errors and saves time in collaborative workflows.

If you'd like, I can add:
- A small Node.js script that validates `data/patterns.json` fields.
- A GitHub Actions workflow that runs the validator on push/PR.

Example (validator using `ajv`):
```bash
# install (in a node-based environment)
npm install -g ajv-cli
ajv validate -s .github/validation/patterns.schema.json -d data/patterns.json
```

### Numeric vs String price fields — What to use and why

- Use `number` for `pricePerSquareInch`: The cost calculator in `scripts/form.js` performs numeric calculations (area * price). Keeping the price as a number makes it straightforward and avoids unnecessary parsing.
- If you convert prices to strings (e.g. `"$0.02"` or `"0.02"`), your JavaScript must parse those strings back into numbers using `parseFloat()` or similar — this increases opportunities for bugs (e.g. `"$0.02"` needs the `$` removed) and currency formatting gets mixed with data.
- If you want to store human-readable formats (e.g. `"$0.02"`) keep a dedicated `displayPrice` or `formattedPrice` key for UI only, and leave `pricePerSquareInch` numeric for calculations.

Example for both fields:
```json
{
	"pricePerSquareInch": 0.020,
	"formattedPrice": "$0.020" // used only for display on the page
}
```

---

If you'd like, I can:
- Add a small `scripts/validatePatterns.js` to automatically check `data/patterns.json` (and add a GitHub Action workflow to run it on PRs), or
- Convert all numeric values to strings and update scripts to parse them consistently (not recommended unless you need localized display formats in JSON).

Tell me which you prefer and I can add the validation script and/or CI workflow for you.
