<?php

namespace App\Lib\Logging;

use \Lib\Mysql;
use \Lib\Debug\Debugger;


class LoadVideoHits
{
    public static function load($userId)
    {
        $sql = "SELECT *, COUNT(page_hit_id) AS hit_count
                FROM page_hit AS ph
                LEFT JOIN page AS p ON ph.page_id = p.page_id
                LEFT JOIN session AS s ON ph.session_id = s.session_id
                -- //LEFT JOIN page_type AS pt ON p.page_type_id = pt.page_type_id
                WHERE s.user_profile_id = ?
                AND p.page_type_id = 3
                GROUP BY p.page_id"; // limit to popup video

        $hits = Mysql::fetchAll($sql, [$userId]);

        // Debugger::debug($hits);

        $results = [];

        foreach ($hits as $item) {
            $results[$item->page_name] = $item->hit_count;
        }

        Debugger::debug($results);

        return $results;
    }
}