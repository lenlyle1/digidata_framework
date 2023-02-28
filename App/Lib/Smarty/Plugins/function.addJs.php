<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

/**
 * Smarty {addJs} function plugin
 * Type:     function<br>
 * Name:     addJs<br>
 * Purpose:  add js script to stack for compression
 *
 * @author Len Lyle
 * @param array                    $params   parameters
 * @param Smarty_Internal_Template $template template object
 *
 * @return string|null
 */
function smarty_function_addJs($params, $template)
{
    global $jsFiles;

    $jsFiles[] = $params['file'];
}


