<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

use \Lib\Debug\Debugger;

/**
 * Smarty {calcAge} function plugin
 * Type:     function<br>
 * Name:     userCan<br>
 *
 * @author Len Lyle
 * @param array                    $params   parameters
 * @param Smarty_Internal_Template $template template object
 *
 * @return string|null
 */
function smarty_function_calcAge($params, $template)
{
    $d1 = new DateTime($params['dob']);
    $d2 = new DateTime();

    $age = $d1->diff($d2)->y;

    if($age == 0){
        $age = $d1->diff($d2)->m . ' months';
    }

    return $age;
}