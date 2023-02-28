<?php

/*----------------------------------------------------------------------
 |
 |  Bootstrap for site.  Sets environment and loads key libraries
 |
 ---------------------------------------------------------------------*/

/* timezone */
date_default_timezone_set('UTC');

error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

    define("IS_LIVE", false);

define('ROOT_DIR', __DIR__);
define("PUBLIC_ROOT", ROOT_DIR . '/public');
set_include_path(get_include_path() . PATH_SEPARATOR . realpath(ROOT_DIR . "/App/"));

// Autoloader
require (__DIR__ . '/vendor/autoload.php');

if(IS_LIVE){
    $configFile = 'App/Configs/live.php';
} else {
    $configFile = 'App/Configs/dev.php';
}
require $configFile;

\Lib\Debug\Debugger::setPath(__DIR__ . '/debuglogs/');

// error reporting
error_reporting(E_ALL & ~E_NOTICE);

if(!IS_LIVE){
    ini_set('display_errors', 1);
}


// // convert to static class
// if(class_exists('Memcached')){
//     $memc = new Lib\Database\Memc($settings->memc_server, $settings->memc_port);
// } else {
//     die('Memcached class does not exist');
// }

// Configure DB
$db = new Lib\Database\Mysql\DB(
    $settings->db->host, 
    $settings->db->port, 
    $settings->db->name, 
    $settings->db->user, 
    $settings->db->pass
);


