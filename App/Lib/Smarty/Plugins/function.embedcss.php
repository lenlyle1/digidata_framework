<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

function smarty_function_embedcss($params)
{
	global $settings;

	if(empty($params['cssfile'])){
		return;
	}


	// hack to force no caching on dev
	if(!IS_LIVE && !$settings->compressCSS){
		$date = new DateTime();
		$params['cssfile'] .= '?v=' . $date->getTimestamp();
	}	

	$settings->cssStack[] = $params['cssfile'];

	if(!$settings->compressCSS){
		return '<link rel="stylesheet" href="' . $params['cssfile'] . '">';
	}
}