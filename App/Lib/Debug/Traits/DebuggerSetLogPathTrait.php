<?php

namespace Lib\Debug\Traits;

trait DebuggerSetLogPathTrait
{
    public static function setPath($path)
    {
        self::$logPath = $path;
    }
}