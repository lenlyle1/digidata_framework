<?php

namespace Lib\Utils;

use \Lib\Debug\Debugger;

class Redirect
{
    public static function go($url)
    {
        Debugger::debug($url, 'Redirecting to:', true);
        header('Location:'.$url);
        exit;
    }
}