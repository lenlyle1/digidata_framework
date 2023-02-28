<?php

namespace Lib\User;

use \Lib\Validation\UserEmailValidator;
use \Lib\Mailer\SendMail;
use \Lib\Debug\Debugger;
use \Models\User;

class PasswordResetConfirmToken
{
    public static function confirm($token)
    {
        $userModel = new User();

        $user = $userModel->getOne('reset_token', $token);

        if ($user) {
            // check token not expired
            $tokenDate = new \DateTime($user->token_time);
            $tokenDate->add(new \DateInterval('P1D'));

            $dateNow = new \DateTime("now");

            if ($tokenDate < $dateNow){
                return [
                    'success' => false,
                    'error' => 'Token has expired'
                ];
            }
            return [
                'success' => true,
                'user' => $user,
                'error' => null
            ];
        } else {
            return [
                'success' => false,
                'error' => 'Invalid token'
            ];
        }
    }
}