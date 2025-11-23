// forms.js
// Purpose: populate the pattern selector, show a preview, and calculate quilting cost.
// Learning notes:
// - I used the Fetch API to load JSON and then manipulated the DOM to show options.
// - Keep logic simple: fetch -> populate -> attach events.
// - Next improvement: extract smaller functions and add unit tests.

// This is an event listener (a function that waits for something to happen, like the page loading).
// It uses the DOMContentLoaded event (a built-in event that fires when the HTML is ready).
// The async keyword means this function can wait for things like fetching data without freezing the page.
// Inside, we have variables (named storage spots for data) that grab HTML elements using getElementById (a method to find elements by their id attribute).
document.addEventListener("DOMContentLoaded", async () => {
    // These are variable declarations (creating named spots for data).
    // They use const (a keyword for variables that won't change) to store references to HTML elements.
    // getElementById is a method (a function attached to an object) that finds elements in the DOM (Document Object Model, the page's structure).
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

    // This is a try-catch block (a way to handle errors gracefully).
    // Try runs the code, and if something goes wrong, catch deals with it.
    try {
        // Fetch pattern data
        // fetch is a function (built-in) that makes a network request to get data from a URL.
        // await is an operator (keyword) that pauses the function until the fetch promise (a promise is like a future result) resolves.
        // response is a variable holding the fetch result.
        const response = await fetch("data/patterns.json"); // adjust path if needed
        // if statement (conditional check) with ! (not operator) and .ok (property check).
        // throw is a keyword to create an error if the response isn't okay.
        if (!response.ok) throw new Error("Network response was not ok");
        // .json() is a method that converts the response to a JavaScript object (array of patterns).
        // await again because it's asynchronous.
        const patterns = await response.json();

        // Populate dropdown
        // innerHTML is a property (a way to set HTML content inside an element).
        // = is an assignment operator (sets the value).
        patternSelect.innerHTML =
            '<option value="" disabled selected>Choose a pattern...</option>';
        // forEach is a method on arrays (loops over each item).
        // It takes a function (anonymous arrow function here) as a parameter.
        // Inside: createElement is a method to make new HTML elements.
        // .value and .textContent are properties to set attributes and text.
        // appendChild is a method to add the new element to the parent.
        patterns.forEach((pattern) => {
            const option = document.createElement("option");
            option.value = pattern.id;
            option.textContent = pattern.name;
            patternSelect.appendChild(option);
        });

        // Pattern select change event
        // Note: I keep preview data on the DOM using `dataset` for simplicity.
        // addEventListener is a method to attach an event handler (function that runs on an event).
        // "change" is the event type (fires when the select value changes).
        // The handler is an arrow function (short way to write a function).
        patternSelect.addEventListener("change", (event) => {
            // find is a method on arrays (searches for an item that matches).
            // It uses an arrow function with == (loose equality operator, compares values).
            // selectedPattern is a variable from the find result.
            const selectedPattern = patterns.find(
                (pattern) => pattern.id == event.target.value
            );
            // if statement (conditional) with && (and operator) for checks.
            if (selectedPattern) {
                // .src and .alt are properties to set image source and alt text.
                // .textContent sets the text inside elements.
                // + is a concatenation operator (joins strings).
                // || is the or operator (fallback value).
                // .toFixed is a method on numbers (formats to decimal places).
                patternImage.src = selectedPattern.image;
                patternImage.alt = selectedPattern.name;
                patternName.textContent = selectedPattern.name;
                patternDesc.textContent = selectedPattern.description;
                // Support multiple JSON key names for price (legacy or different sources)
                const pricePerSq = selectedPattern.price_per_sq_in || selectedPattern.pricePerSquareInch || selectedPattern.pricePerSqIn || 0.035;
                patternPrice.textContent = `Price: $${pricePerSq.toFixed(3)} per sq in`;
                // .style.display is a property to show/hide elements.
                // = assignment operator.
                patternPreview.style.display = "block";
                // Store price per sq in for calculator
                // Learning note: storing small state on DOM elements is okay for small projects,
                // but in larger apps consider a central state object or framework.
                // dataset is a property for custom data attributes.
                patternPreview.dataset.price = pricePerSq;
                // if statement with && (and) to check if calcResult exists.
                if (calcResult) calcResult.textContent = "";
            } else {
                // else block (runs if if condition is false).
                patternPreview.style.display = "none";
            }
        });

        // Calculator event
        // Tip: validate inputs early to avoid NaN issues in calculations.
        // if statement to check if calcBtn exists.
        if (calcBtn) {
            // addEventListener again for "click" event.
            calcBtn.addEventListener("click", () => {
                // parseFloat is a function (converts string to number).
                // .value is a property to get input values.
                const length = parseFloat(quiltLength.value);
                const width = parseFloat(quiltWidth.value);
                const pricePerSqIn = parseFloat(patternPreview.dataset.price || 0.035);

                // if statement with || (or) and && (and) operators for validation.
                // isNaN is a function (checks if not a number).
                // <= is a comparison operator (less than or equal).
                if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
                    calcResult.textContent = "Please enter valid length and width.";
                    return; // return statement (exits the function early).
                }

                // * is the multiplication operator.
                const area = length * width;
                const cost = area * pricePerSqIn;
                // .toFixed method again for formatting.
                calcResult.textContent = `Estimated quilting cost: $${cost.toFixed(2)}`;
            });
        }
    } catch (error) {
        // catch block: console.error is a function (logs errors to console).
        // alert is a function (shows a popup message).
        console.error("Error loading patterns:", error);
        alert("There was an error loading the patterns. Please try again later.");
    }
});