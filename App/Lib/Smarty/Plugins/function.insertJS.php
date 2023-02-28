<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

use \Lib\Debug\Debugger;
use Patchwork\JSqueeze;

/**
 * Smarty {insertJS} function plugin
 * Type:     function<br>
 * Name:     insertJS<br>
 *
 * @author Len Lyle
 * @param array                    $params   parameters
 * @param Smarty_Internal_Template $template template object
 *
 * @return string|null
 */
function smarty_function_insertJS($params, $template)
{
    global $jsFiles;

    $js = '';
    $timeStr = '';
    $publicPathReal = ROOT_DIR . '/public';
    $files = [];

    foreach($jsFiles as $k => $file){
        if(COMPRESSJS){
            //get timestamps and create name
            $timeStr .= filemtime($publicPathReal . $file);
            $files[] = $file;
            unset($jsFiles[$k]);
        } else {
            $js .= '<script src="' . $file . '"></script>' . "\n";
        }
    }

    // check for compressed file, create if not there
    if(COMPRESSJS){
        $md5Name = md5($timeStr);
        $compressedJsPath = '/assets/compressed/js/';
        $uncompressedJs = '';
        $filename = $publicPathReal . $compressedJsPath . $md5Name . '.js';


        if(!is_dir($publicPathReal . $compressedJsPath)){
            mkdir($publicPathReal . $compressedJsPath, 0777, true);
        }


        if (count($files) > 0) {
            if(!file_exists($filename)){
                foreach($files as $file){
                    $uncompressedJs .= file_get_contents($publicPathReal . $file);
                }
                //Debugger::debug($uncompressedJs);
                $jz = new JSqueeze();

                $minifiedJs = $jz->squeeze(
                    $uncompressedJs,
                    true,   // $singleLine
                    false,  // $keepImportantComments
                    false   // $specialVarRx
                );

                file_put_contents($filename, $minifiedJs);
            }
            $js .= '<script src="' . $compressedJsPath . $md5Name . '.js' . '"></script>' . "\n";
        }
    }

    // clear the stack
    unset($jsFiles);
    return $js;
}