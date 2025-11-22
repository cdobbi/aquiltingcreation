// forms.js
// Purpose: populate the pattern selector, show a preview, and calculate quilting cost.
// Learning notes (beginner voice):
// - I used the Fetch API to load JSON and then manipulated the DOM to show options.
// - Keep logic simple: fetch -> populate -> attach events.
// - Next improvement: extract smaller functions and add unit tests.

document.addEventListener("DOMContentLoaded", async () => {
    const patternSelect = document.getElementById("pattern-select");
    const patternImage = document.getElementById("pattern-image");
    const patternName = document.getElementById("pattern-name");
    const patternDesc = document.getElementById("pattern-desc");
    const patternPrice = document.getElementById("pattern-price");
    const patternPreview = document.getElementById("pattern-preview");
    const quiltLength = document.getElementById("quilt-length");
    const quiltWidth = document.getElementById("quilt-width");
    const calcBtn = document.getElementById("calc-cost-btn");
    const calcResult = document.getElementById("calc-result");

    try {
        // Fetch pattern data
        const response = await fetch("data/patterns.json"); // adjust path if needed
        if (!response.ok) throw new Error("Network response was not ok");
        const patterns = await response.json();

        // Populate dropdown
        patternSelect.innerHTML =
            '<option value="" disabled selected>Choose a pattern...</option>';
        patterns.forEach((pattern) => {
            const option = document.createElement("option");
            option.value = pattern.id;
            option.textContent = pattern.name;
            patternSelect.appendChild(option);
        });

        // Pattern select change event
        // Note: I keep preview data on the DOM using `dataset` for simplicity.
        patternSelect.addEventListener("change", (event) => {
            const selectedPattern = patterns.find(
                (pattern) => pattern.id == event.target.value
            );
            if (selectedPattern) {
                patternImage.src = selectedPattern.image;
                patternImage.alt = selectedPattern.name;
                patternName.textContent = selectedPattern.name;
                patternDesc.textContent = selectedPattern.description;
                patternPrice.textContent =
                    "Price: $" +
                    (selectedPattern.price_per_sq_in || 0.035).toFixed(3) +
                    " per sq in";
                patternPreview.style.display = "block";
                // Store price per sq in for calculator
                // Learning note: storing small state on DOM elements is okay for small projects,
                // but in larger apps consider a central state object or framework.
                patternPreview.dataset.price = selectedPattern.price_per_sq_in || 0.035;
                if (calcResult) calcResult.textContent = "";
            } else {
                patternPreview.style.display = "none";
            }
        });

        // Calculator event
        // Tip: validate inputs early to avoid NaN issues in calculations.
        if (calcBtn) {
            calcBtn.addEventListener("click", () => {
                const length = parseFloat(quiltLength.value);
                const width = parseFloat(quiltWidth.value);
                const pricePerSqIn = parseFloat(patternPreview.dataset.price || 0.035);

                if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
                    calcResult.textContent = "Please enter valid length and width.";
                    return;
                }

                const area = length * width;
                const cost = area * pricePerSqIn;
                calcResult.textContent = `Estimated quilting cost: $${cost.toFixed(2)}`;
            });
        }
    } catch (error) {
        console.error("Error loading patterns:", error);
        alert("There was an error loading the patterns. Please try again later.");
    }
});