<?php

namespace Lib\Utils;

use \Lib\Session\Session;
use \Lib\Debug\Debugger;

class CSRF
{
    public static function createToken()
    {
        $name = 'csrf_' . uniqid();
        $token = substr(base64_encode(mt_rand()), 0, 15);

        self::saveToken($name, $token);

        return [
            'name' => $name,
            'value' => $token
        ];
    }

    public static function saveToken($name, $token)
    {
        if (!$csrf = Session::get('CSRF')) {
            $csrf = [];
        }

        $csrf[$name] = $token;

        Session::set('CSRF', $csrf);
    }

    public static function validateToken($name, $token)
    {
        Debugger::debug($name, 'csrf name');

        $csrf = Session::get('CSRF');

        Session::wipe('CSRF');

        if (!empty($csrf[$name] && $csrf[$name] == $token)) {
            return true;
        }

        return false;
    }
}