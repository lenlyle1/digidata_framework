<?php
// reverse engineer the db to create the required models
/*
    You MUST set the servername to either local or live

    This script must be run via cli
*/
$_SERVER['SERVER_NAME'] = 'local';

require_once 'bootstrap.php';

use \Lib\Debug\Debugger;

// get the table names
$sql = "SELECT table_name FROM information_schema.tables where table_schema = ?";

$tables = $db->fetchAll($sql, [$settings->db->name]);

// make sure dir exists
if (!is_dir(ROOT_DIR . '/App/Models/')) {
    mkdir(ROOT_DIR . '/App/Models/');
}

// create the models
foreach ($tables as $table) {
    $modelName = str_replace(' ', '', ucwords(str_replace('_', ' ', $table->table_name)));

    $newModel = file_get_contents(__DIR__ . '/modelTemplate.txt');

    $newModel = str_replace('[CLASS_NAME]', $modelName, $newModel);
    $newModel = str_replace('[TABLE_NAME]', $table->table_name, $newModel);

    file_put_contents(ROOT_DIR . '/App/Models/' . $modelName . '.php', $newModel);
}


