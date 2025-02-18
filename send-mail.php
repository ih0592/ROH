<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ontvang de form data
    $naam = $_POST['naam'];
    $email = $_POST['email'];
    $telefoon = $_POST['telefoon'];
    $bericht = $_POST['bericht'];
    
    // E-mail ontvanger
    $to = "info@rechtopherstel.nl";
    
    // E-mail onderwerp
    $subject = "Nieuw contactformulier inzending van " . $naam;
    
    // E-mail bericht
    $message = "Er is een nieuw bericht ontvangen via het contactformulier:\n\n";
    $message .= "Naam: " . $naam . "\n";
    $message .= "E-mail: " . $email . "\n";
    $message .= "Telefoon: " . $telefoon . "\n\n";
    $message .= "Bericht:\n" . $bericht;
    
    // E-mail headers
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Verstuur e-mail
    if(mail($to, $subject, $message, $headers)) {
        // Redirect na succesvol versturen
        header("Location: bedankt.html");
        exit();
    } else {
        echo "Er is iets misgegaan. Probeer het later opnieuw.";
    }
}
?> 