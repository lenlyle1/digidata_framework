<?php

namespace Lib\User;

use \Lib\Mailer\SendMail;
use \Lib\Debug\Debugger;
use \Lib\User\User;

class PasswordResetCreateToken
{
    public static function send($username)
    {
        $userDetails = User::load(null, null, null, null, $username);

        Debugger::debug($userDetails);

        if($userDetails['success']) {
            // create the token
            $token = self::createToken(32);

            // save the token in the user
            $user = new \Models\User();
            $user->setValues([
                'user_id' => $userDetails['payload']->user_id,
                'reset_token' => $token,
                'token_time' => date("Y-m-d H:i:s")
            ]);
            $user->save();

            return [
                'success' => true,
                'user' => $userDetails['payload'],
                'token' => $token
            ];
        } else {
            return $userDetails;
        }
    }

    public static function createToken($length)
    {
        return bin2hex(openssl_random_pseudo_bytes($length));
    }
}