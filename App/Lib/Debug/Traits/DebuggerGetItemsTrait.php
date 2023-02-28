<?php

namespace Lib\Debug\Traits;

trait DebuggerGetItemsTrait
{
    public static function getItems()
    {
        return self::$debugItems;
    }
}