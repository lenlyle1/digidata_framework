<?php

namespace Lib\Mailer;

use \Lib\Debug\Debugger;

class SendMail
{
    public static function send($email, $name, $subject, $htmlMsg, $txtMsg)
    {
        // email address good, build email and send
        $mail = new \PHPMailer(true);

        try {
            $mail->isSMTP();
            //debugging
            $mail->SMTPDebug = (ISLIVE) ? 0 : 3;
            $mail->Debugoutput = 'html';
            $mail->SMTPAuth = true;
            $mail->SMTPSecure = 'tls';
            // smtp server settings
            $mail->Host = SMTP_HOST;
            $mail->Port = 25;
            $mail->SMTPAuth = true;
            $mail->Username = SMTP_USERNAME;
            $mail->Password = SMTP_PASSWORD;
            // mail settings
            $mail->setFrom(SMTP_USERNAME, SMTP_FROM_NAME);
            $mail->addReplyTo(SMTP_REPLY_TO, SMTP_REPLY_TO_NAME);
            $mail->addAddress($email, $name);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $htmlMsg;
            $mail->AltBody = $txtMsg;

            $mail->send();

            return true;
        } catch (\phpmailerException $e) {
            Debugger::debug($e->errorMessage(), 'phpmailerException'); //Pretty error messages from PHPMailer
            return false;
        } catch (\Exception $e) {
            Debugger::debug($e->errorMessage(), 'Exception'); //Boring error messages from anything else!
            return false;
        }

    }
}