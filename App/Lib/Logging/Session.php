<?php

namespace App\Lib\Logging;

use \Lib\Mysql;

class Session
{
    public static function log($sessionId, $userId)
    {
        $sql = "INSERT INTO session (
                    session_id,
                    user_profile_id,
                    start_time
                ) VALUES (
                    ?,
                    ?,
                    NOW()
                )";

        Mysql::insertUpdate($sql, [
            $sessionId,
            $userId
        ]);
    }


}