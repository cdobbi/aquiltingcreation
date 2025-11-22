// custom-captcha.js
// Purpose: a very small client-side captcha (learning exercise).
// Notes (beginner voice):
// - This is NOT a secure captcha; it's only for learning and simple spam-reduction.
// - Always validate on the server side too (see `submit_form.php` for reCAPTCHA usage).

document.addEventListener("DOMContentLoaded", function () {
    // Generate two random numbers
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const answer = a + b;

    // Store answer in localStorage (or sessionStorage)
    localStorage.setItem("captcha_answer", answer);

    // Show the question
    // Learning note: this uses localStorage for simplicity; sessionStorage could also be used.
    const label = document.getElementById("captcha-label");
    if (label) label.textContent = `Verify you are not a robot. What is ${a} + ${b}?`;
});

// On form submit, check the answer
const designForm = document.getElementById("design-form");
if (designForm) {
    designForm.addEventListener("submit", function (e) {
        const userAnswerEl = document.getElementById("captcha-answer");
        const userAnswer = userAnswerEl ? userAnswerEl.value.trim() : '';
        const realAnswer = localStorage.getItem("captcha_answer");
        if (userAnswer !== realAnswer) {
            e.preventDefault();
            alert("CAPTCHA incorrect. Please try again.");
        }
    });
}