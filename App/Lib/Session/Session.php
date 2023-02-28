<?php

namespace Lib\Session;

use \Lib\Debug\Debugger;

class Session
{
    public static function get($name)
    {
        if(!empty($_SESSION[$name])){
            return $_SESSION[$name];
        }

        return null;
    }

    public static function set($name, $var)
    {
        $_SESSION[$name] = $var;
    }

    public static function wipe($name)
    {
        Debugger::debug('Wiping ' . $name);
        unset($_SESSION[$name]);
        Debugger::debug($_SESSION[$name], 'AFTER WIPE');
    }

    public function saveToDb($userId, $sessionId, $startTime = null, $endTime = null)
    {
        $session = new Models\Session();

        $values = [
            'session_id' => $sessionId,
            'user_id' => $userId
        ];

        if ($startTime) {
            $values['start_time'] = $startTime;
        } else if ($endTime) {
            $values['end_time'] = $endTime;
        } else {
            // throw error, session must be starting or finishing

        }


        $session->addValues($values);
        $session->save();
    }
}