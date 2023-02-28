<?php
// bootstrap
require_once '../bootstrap.php';

use \Lib\Debug\Debugger;
use \Lib\Smarty\Template;
use \Lib\Session\Session;
use \Lib\Database\DbGetter;


session_start();
// site bootstrapping
require_once ROOT_DIR . '/App/Bootstrap/bootstrapSite.php';

// Load routes
$router = new \App\Routing\Router(ROOT_DIR . '/App/Routing/Routes');

try {
    $tpl = $router->processRoutes();
    // Template::assign('route', $route);
} catch (TypeError $e) {
    Debugger::debug($e->getMessage());
}

if(!empty($_GET['mcflush']) && $_GET['mcflush'] == true){
    $memc->flush();
}

Template::assign('router', $router);
Template::assign('headerClass', 'default');

if(!empty($tpl)){
    try {
        $smarty->display($tpl . '.tpl');
    } catch (Exception $e) {
        if (!IS_LIVE) {
            Template::assign('missingTemplate', $e->getMessage());
        }
        $smarty->display('404/404.tpl');
    }
} else {
    $smarty->display('404/404.tpl');
}


