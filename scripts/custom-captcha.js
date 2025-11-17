document.addEventListener("DOMContentLoaded", function () {
    // Generate two random numbers
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const answer = a + b;

    // Store answer in localStorage (or sessionStorage)
    localStorage.setItem("captcha_answer", answer);

    // Show the question
    document.getElementById("captcha-label").textContent = `Verify you are not a robot. What is ${a} + ${b}?`;
});

// On form submit, check the answer
document.getElementById("design-form").addEventListener("submit", function (e) {
    const userAnswer = document.getElementById("captcha-answer").value.trim();
    const realAnswer = localStorage.getItem("captcha_answer");
    if (userAnswer !== realAnswer) {
        e.preventDefault();
        alert("CAPTCHA incorrect. Please try again.");
    }
});