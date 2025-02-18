<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ontvang de form data
    $naam = htmlspecialchars($_POST['naam']);
    $email = htmlspecialchars($_POST['email']);
    $telefoon = htmlspecialchars($_POST['telefoon']);
    $bericht = htmlspecialchars($_POST['bericht']);
    
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
        header("Location: ../bedankt.html");
        exit();
    } else {
        echo "Er is iets misgegaan. Probeer het later opnieuw.";
    }
}

?> 