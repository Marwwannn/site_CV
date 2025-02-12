<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    $to = "marw.youm@gmail.com";
    $subject = "Nouveau message de votre portfolio";
    $body = "De: $name\nEmail: $email\n\nMessage:\n$message";
    
    mail($to, $subject, $body);
}
?> 