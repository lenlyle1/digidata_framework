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
function smarty_function_get_csrf($params, $template)
{
    $csrf = new Lib\Utils\CSRF();
    $csrfValues = $csrf->createToken();

    // hidden form fields
    $formToken = '<input type="hidden" name="csrf_name" value="' . $csrfValues['name'] . '" \>';
    $formToken .= '<input type="hidden" name="csrf_value" value="' . $csrfValues['value'] . '" \>';

    // inject form fields
    return $formToken;
}


