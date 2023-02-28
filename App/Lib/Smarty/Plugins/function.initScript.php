<?php
/**
 * Smarty plugin
 *
 * @package    Smarty
 * @subpackage PluginsFunction
 */

function smarty_function_initScript($params)
{
	$script = $params['script'];

	echo "<script>
			$(document).ready(function(){
				" . $script . ".init(true);
			});
		</script>";
}