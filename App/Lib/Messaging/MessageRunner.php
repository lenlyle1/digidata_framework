<?php

namespace Lib\Messaging;

use \Lib\Debug\Debugger;
use \Lib\Session\Session;

class MessageRunner
{
    private static $namespace = "messageStack";

    private static $stack = [];

    public static function addMessage($type, $message)
    {
        if (empty($_SESSION)) {
            session_start();
        }

        //Debugger::debug(self::$stack);

        self::$stack[$type][] = $message;

        Session::set(self::$namespace, self::$stack);

        //Debugger::debug($_SESSION);
    }

    public static function clearMessages()
    {
        Session::wipe(self::$namespace);
    }

    public static function getMessages()
    {
        return self::$stack;
    }
}