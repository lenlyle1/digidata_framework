<?php

use \Lib\Smarty\Template;
use \Lib\Session\Session;
use \Lib\Debug\Debugger;
use \Lib\Utils\Timezone;

date_default_timezone_set('America/Los_Angeles');
// Set up smarty
$smarty = new Smarty();

if(!IS_LIVE){
    //$smarty->debugging = SMARTY_DEBUG;
}

$smarty->caching = 0;
$smarty->addPluginsDir(ROOT_DIR . '/App/Lib/Smarty/Plugins/');
$smarty->setTemplateDir(ROOT_DIR . '/Views');
$smarty->setCompileDir(ROOT_DIR . '/templates_c/');
$smarty->setCacheDir(ROOT_DIR . '/smarty_cache/');
$config['time'] = '%r';
$smarty->assign('config', $config);

/** ========================================================
 *  Assign default variables
 * =======================================================*/
Template::assign('sitename', $settings->sitename);
Template::assign('is_live', (IS_LIVE) ? 'true' : 'false');
Template::assign('user', Session::get('user'));
Template::assign('loggedIn', ((Session::get('user')) ? true : false));
Template::assign('userPermissions', Session::get('permissions'));
Template::assign('currentUrl', $_SERVER['REQUEST_URI']);
Template::assign('jsVersion', 1);

// api credentials
Template::assign('auth_id', 'superadmin');
Template::assign('auth_public', '128b733a-dffb-4095-b8b3-0075e18bb366');

// if(empty(Session::get('tzList'))) {
//     Session::set('tzList', Timezone::load());
// }

Template::assign('tzList', Timezone::load());

