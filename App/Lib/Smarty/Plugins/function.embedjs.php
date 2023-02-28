<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

function smarty_function_embedjs($params)
{
	global $settings;

	//Debugger::debug($params);
	// hack to force no caching on dev
	if(!IS_LIVE && !$settings->compressJS){
		$date = new DateTime();
		$params['script'] .= '?v=' . $date->getTimestamp();
	}

	$settings->jsStack[] = $params['script'];
	
	if(!$settings->compressJS){
		return '<script src="' . $params['script'] . '"></script>';
	}
}