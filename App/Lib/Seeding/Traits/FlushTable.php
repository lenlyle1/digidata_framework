<?php

namespace Lib\Seeding\Traits;

Trait FlushTable
{
	public function flushTable($table)
	{
		dump('Flushing ' . $table);

		$sql = "TRUNCATE TABLE {$table}";
		
		\Lib\DB\Mysql::runQuery($sql);
	}
}