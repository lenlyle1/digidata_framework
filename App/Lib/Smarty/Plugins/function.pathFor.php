<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

/**
 * Smarty {pathFor} function plugin
 * Type:     function<br>
 * Name:     pathFor<br>
 * Purpose:  reverse route path
 *
 * @author Len Lyle
 * @param array                    $params   parameters
 * @param Smarty_Internal_Template $template template object
 *
 * @return string|null
 */
function smarty_function_pathFor($params, $template)
{
    global $router;

    return $router->generate($params['name']);
}


