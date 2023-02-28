<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */
use MatthiasMullie\Minify;
use Lib\Utils\Debugger;

function smarty_function_compile_stack($params, $smarty)
{
	global $settings;

	$combinedDir = PUBLIC_ROOT . '/assets/combined/';
	if(!is_dir($combinedDir)){
		mkdir($combinedDir);
	}

	$page = $smarty->getTemplateVars('page');
	$module = $smarty->getTemplateVars('module');

	// compressCSS
	if($settings->compressCSS){
		$cssTs = 0;

		foreach($settings->cssStack as $cssFile){
			$cssTs .= filemtime(PUBLIC_ROOT . $cssFile);
		}

		$cssKey = md5($cssTs);
		
		$combinedName = $cssKey . '.css';
		//Debugger::debug($combinedName);
		if(!file_exists($combinedDir . $combinedName)){
			$buffer = loadAll($settings->cssStack);
			
			$buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
			$buffer = str_replace(': ', ':', $buffer);
			$buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);

			$fp = fopen($combinedDir . $combinedName, 'w');
			fputs($fp, $buffer);
			fclose($fp);
		}

		echo '<link rel="stylesheet" href="/assets/combined/' . $combinedName . '"">';
	}


	if($settings->compressJS){
		$jsTs = 0;
		$jsNames ='';
		// compressJS
		foreach($settings->jsStack as $jsFile){
			$jsTs .= filemtime(PUBLIC_ROOT . $jsFile);
			$jsNames .= $jsFile . "\n";
		}

		$jsKey = md5($jsTs);

		$combinedName = $jsKey . '.js';

			//dump($settings->jsStack);
		if(!file_exists($combinedDir . $combinedName)){
			$buffer = loadAll($settings->jsStack);
			

			//$buffer = JSMin::minify($buffer);

			$fp = fopen($combinedDir . $combinedName, 'w');
			fputs($fp, $buffer);
			fclose($fp);
		}


		echo '<script src="/assets/combined/' . $combinedName . '""></script>';
	}
}

function loadAll($stack)
{
	$combined = '';

	foreach($stack as $file){
		$combined .= file_get_contents(PUBLIC_ROOT . $file) . "\n";
	}

	return $combined;
}