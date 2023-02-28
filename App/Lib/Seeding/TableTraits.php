<?php

namespace Lib\Seeding;

Trait TableTraits
{
	public function flush($table)
	{
		dump($table);

		$sql = "DELETE * FROM {$table}";
		dump($sql);
		//Mysql::runQuery($sql);
	}
}