<?php

namespace App\Lib\Logging;

use \Lib\Mysql;

class SessionEnd
{
    public static function log($sessionId, $userId)
    {
        $sql = "UPDATE session
                SET end_time = NOW()
                WHERE session_id = ?
                AND user_profile_id = ?";

        Mysql::insertUpdate($sql, [
            $sessionId,
            $userId
        ]);
    }


}