<?php
// enviar.php

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

// Os namespaces continuam os mesmos
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Verifica se é uma requisição POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Sanitização dos dados (Prevenção XSS)
    $nome = strip_tags(trim($_POST['nome']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $mensagem = strip_tags(trim($_POST['mensagem']));

    // 2. Validação Básica
    if (empty($nome) || empty($email) || empty($mensagem)) {
        die("Erro: Todos os campos são obrigatórios.");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Erro: Formato de e-mail inválido.");
    }

    $mail = new PHPMailer(true);

    try {
        // --- CONFIGURAÇÕES DO SERVIDOR (SMTP) ---
        // $mail->SMTPDebug = 2; // Habilite apenas para debug
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';    // SEU_HOST (ex: smtp.gmail.com)
        $mail->SMTPAuth   = true;
        $mail->Username   = 'gustavo.ffernandes8@gmail.com';   // SEU_EMAIL
        $mail->Password   = 'qros jfci jlce szrm';       // SUA_SENHA (use App Password se for Gmail)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // --- DESTINATÁRIOS ---
        $mail->setFrom('gustavo.ffernandes8@gmail.com', 'Módulo NEE - Contato'); // Remetente sistema
        $mail->addAddress('lucassagica5@gmail.com', 'Equipe de Acessibilidade'); // Quem recebe
        $mail->addReplyTo($email, $nome); // Responder para o usuário que preencheu

        // --- CONTEÚDO DO EMAIL ---
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = "Nova dúvida via Site: $nome";
        
        // Corpo do email formatado
        $bodyContent = "
        <h3>Nova Mensagem Recebida</h3>
        <p><strong>Nome:</strong> $nome</p>
        <p><strong>E-mail:</strong> $email</p>
        <p><strong>Mensagem:</strong></p>
        <blockquote style='border-left: 4px solid #004d40; padding-left: 10px; color: #555;'>
            " . nl2br($mensagem) . "
        </blockquote>
        <br>
        <small>Enviado através da Landing Page do PIAPE.</small>
        ";
        
        $mail->Body    = $bodyContent;
        $mail->AltBody = "Nome: $nome\nE-mail: $email\n\nMensagem:\n$mensagem";

        $mail->send();
        
        // Redireciona de volta com sucesso (pode implementar um alert JS na index)
        echo "<script>alert('Mensagem enviada com sucesso!'); window.location.href='index.html';</script>";

    } catch (Exception $e) {
        // Log do erro (opcional) e feedback ao usuário
        echo "<script>alert('A mensagem não pôde ser enviada. Erro: {$mail->ErrorInfo}'); window.history.back();</script>";
    }
} else {
    // Redireciona se tentar acessar o arquivo diretamente
    header("Location: index.html");
    exit();
}
?>