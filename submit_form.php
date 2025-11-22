<?php
/**
 * submit_form.php
 * Purpose: Receive POSTed form data from contact.html and send an email.
 * Learning notes (beginner voice):
 * - I used a simple .env loader for configuration and PHP's mail() for demonstration.
 * - Important security notes: always sanitize inputs and never trust client-side validation.
 * - Production suggestion: use a proper mail library (PHPMailer) and store secrets outside the webroot.
 */
// Load .env if available (simple loader)
$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0 || strpos($line, '=') === false) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Verify reCAPTCHA
    $recaptchaSecret = $_ENV['RECAPTCHA_SECRET'] ?? '';
    $recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

    if (!$recaptchaSecret) {
        http_response_code(500);
        echo "<h2>Server misconfiguration: reCAPTCHA secret missing.</h2>";
        exit;
    }

    $verifyResponse = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=" . urlencode($recaptchaSecret) . "&response=" . urlencode($recaptchaResponse)
    );
    $responseData = json_decode($verifyResponse);

    if (!$responseData || !$responseData->success) {
        http_response_code(400);
        echo "<h2>reCAPTCHA verification failed. Please try again.</h2>";
        exit;
    }

    // 2. Continue with your form processing
    $to = "longarmquiltingcreations@gmail.com";
    $subject = "New Design Form Submission";
    $headers = "From: longarmquiltingcreations@gmail.com\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    $formData = [];
    foreach ($_POST as $key => $value) {
        if ($key === 'g-recaptcha-response') continue; // Don't include recaptcha in email
        if (is_array($value)) {
            $formData[$key] = implode(", ", array_map('htmlspecialchars', $value));
        } else {
            $formData[$key] = htmlspecialchars($value);
        }
    }

    $message = "<html><body>";
    $message .= "<h1>New Design Form Submission</h1>";
    foreach ($formData as $key => $value) {
        $message .= "<p><strong>" . htmlspecialchars($key) . ":</strong> " . $value . "</p>";
    }
    $message .= "</body></html>";

    if (mail($to, $subject, $message, $headers)) {
        echo "<h2>Form submitted successfully!</h2>";
        echo "<p>Thank you for your submission. We will contact you soon.</p>";
    } else {
        http_response_code(500);
        echo "<h2>There was an error submitting the form.</h2>";
    }
} else {
    http_response_code(405);
    echo "<h2>Method not allowed</h2>";
}
?>