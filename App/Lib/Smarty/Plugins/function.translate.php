<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

use \Lib\Translate\Language;
use \Lib\Session\Session;
use \Lib\Debug\Debugger;

/**
 * Smarty {translate} function plugin
 * Type:     function<br>
 * Name:     translate<br>
 *
 * @author Len Lyle
 * @param array                    $params   parameters
 * @param Smarty_Internal_Template $template template object
 *
 * @return string|null
 */
function smarty_function_translate($params, $template)
{
    global $memc;

    if( BYPASS_TX === true) {
        return $params['text'];
    }

    $translation = Language::loadTranslation($params['key'], Session::get('language'));

    Debugger::debug($translation, $params['key'], false, 'translationslog');

    if (!$translation && Session::get('language') == 'en') {
        // insert
        Language::saveTranslationItem($params['key']);
        Language::saveTranslation($params['key'], 'en', $params['text']);
    }

    $noTranslation = false;

    if (!$translation) {
        $text = $params['text'];
        if ($lang != 'en') {
            $noTranslation = true;
        }
    } else {
        $text = $translation->text;
    }

    if (!empty($params['substitutions'])) {
        foreach($params['substitutions'] as $placeholder => $value) {
            if(!empty($value)){
                $string = preg_replace('/,([^,]*)$/', ' &\1', implode(', ',(is_array($value))? $value : [$value]));
                $text = preg_replace('/\[\[' . $placeholder . '\]\]/', $string, $text);
            }
        }
    }

    //Debugger::debug($text, 'text');

    if(preg_match("/\[\[.*\]\]/", $text)){
        $text = preg_replace('/\[\[.*\]\]/', 'No user input', $text);
    }


    if (!IS_LIVE && $noTranslation) {
        echo '<div class="lang-error">';
    }

    if(empty($params['tplVar'])){
        echo $text;
    } else {
        $template->assign($params['tplVar'], $text);
    }

    if (!IS_LIVE && $noTranslation) {
        echo '</div>';
    }
}