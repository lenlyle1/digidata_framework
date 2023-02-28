<?php

namespace Lib\Debug\Traits;

trait DebuggerWritelogTrait
{
    public static function writelog($file, $message)
    {
        error_log($message, 3, $file . ".log");

    }
}