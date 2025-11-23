// custom-captcha.js
// Purpose: a very small client-side captcha (learning exercise).
// Notes:
// - This is NOT a secure captcha; it's only for learning and simple spam-reduction.

// This is an event listener (a function that waits for something to happen, like the page loading).
// It uses the DOMContentLoaded event (a built-in event that fires when the HTML is ready).
// The function keyword defines a regular function.
document.addEventListener("DOMContentLoaded", function () {
    // Generate two random numbers
    // Math.random() is a function (built-in) that gives a random number between 0 and 1.
    // Math.floor() is a function that rounds down to the nearest whole number.
    // * is the multiplication operator (scales the random number).
    // + is the addition operator (adds 1 to make it 1-10).
    // const is a keyword for variables that won't change.
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    // + is the addition operator here (adds a and b).
    const answer = a + b;

    // Store answer in localStorage (or sessionStorage)
    // localStorage.setItem is a method (a function on localStorage) to save data in the browser.
    // It takes a key (string) and value (converted to string).
    localStorage.setItem("captcha_answer", answer);

    // Show the question
    // Learning note: this uses localStorage for simplicity; sessionStorage could also be used.
    // getElementById is a method to find an HTML element by its id.
    // if statement (conditional check) with ? (ternary operator, shorthand if-else).
    // .textContent is a property to set the text inside an element.
    // Template literals use backticks (`) and ${} for inserting variables (like string concatenation but easier).
    const label = document.getElementById("captcha-label");
    if (label) label.textContent = `Verify you are not a robot. What is ${a} + ${b}?`;
});

// On form submit, check the answer
// getElementById again to find the form element.
// if statement to check if it exists.
const designForm = document.getElementById("design-form");
if (designForm) {
    // addEventListener is a method to attach an event handler.
    // "submit" is the event type (fires when the form is submitted).
    // The handler is a function that takes an event parameter (e, short for event).
    designForm.addEventListener("submit", function (e) {
        // getElementById to find the input element.
        // .value is a property to get the input's value.
        // .trim() is a method on strings (removes extra spaces).
        // || is the or operator (fallback to empty string if element not found).
        const userAnswerEl = document.getElementById("captcha-answer");
        const userAnswer = userAnswerEl ? userAnswerEl.value.trim() : '';
        // localStorage.getItem is a method to retrieve saved data (returns a string).
        const realAnswer = localStorage.getItem("captcha_answer");
        // !== is the strict inequality operator (checks if not equal and same type).
        if (userAnswer !== realAnswer) {
            // e.preventDefault() is a method on the event (stops the form from submitting).
            // alert is a function (shows a popup message).
            alert("CAPTCHA incorrect. Please try again.");
        }
    });
}