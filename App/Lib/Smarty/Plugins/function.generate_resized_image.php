<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

use Lib\ImageTools\Image;
use Lib\Utils\Debugger;
use Lib\Utils\Paths;

function smarty_function_generate_resized_image($params)
{
	if($params['img'] == ''){
		$params['img'] = '/assets/images/not-found.gif';
	}

	$type = $params['type'];

	$nameBits = explode('/',$params['img']);

	$imgName = array_pop($nameBits);

	$imageDir = Paths::getPath('image', ['profile-pics', 'resized']) . 
				Paths::makeSubdir($imgName);

	$nameBits = explode('.', $imgName);

	$ext = array_pop($nameBits);

	$filename = $imageDir . $nameBits[0] . '_' . $params['width'] . '.' . $ext;

	$key = Image::createKey($imgName, $params['width']);

	return '<img src="' . $filename . '?key=' . $key . '&type=' . $type . '"  />';
	return '<img src="' . $filename . '?key=' . $key . '" width="' . $params['width'] . '" />';
}



