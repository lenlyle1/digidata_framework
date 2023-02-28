<?php

namespace Lib\Database;

class DbGetter
{
    public static function getDb()
    {
        global $db;

        return $db;
    }
}