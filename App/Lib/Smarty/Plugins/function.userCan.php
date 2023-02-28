<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

use \Lib\User\User;
use \Lib\Session\Session;
use \Lib\Debug\Debugger;

/**
 * Smarty {userCan} function plugin
 * Type:     function<br>
 * Name:     userCan<br>
 *
 * @author Len Lyle
 * @param array                    $params   parameters
 * @param Smarty_Internal_Template $template template object
 *
 * @return string|null
 */
function smarty_function_userCan($params, $template)
{
    Debugger::debug($params);
    return User::can($params['job'], Session::get('permissions'));
}