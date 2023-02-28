<?php

namespace Lib\Seeding\Traits;

Trait FlushImages
{
	public function FlushImages($dir)
	{
		exec("rm -Rf " . PUBLIC_ROOT . '/assets/images/' . $dir . '/*');
	}
}