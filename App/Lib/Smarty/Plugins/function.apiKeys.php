<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

/**
 * Smarty {apiKeys} function plugin
 * Type:     function<br>
 * Name:     apiKeys<br>
 * Purpose:  reverse route path
 *
 * @author Len Lyle
 * @param array                    $params   parameters
 * @param Smarty_Internal_Template $template template object
 *
 * @return string|null
 */
function smarty_function_apiKeys($params, $template)
{
    $auth_id = 'superadmin';
    $auth_public = '128b733a-dffb-4095-b8b3-0075e18bb366';

    echo '?auth_id=' . $auth_id . '&auth_public=' . $auth_public;
}


