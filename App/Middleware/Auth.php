<?php

namespace Middleware;

Class Auth 
{
	private static $exemptions = [];

	public static function addExemption($exemption)
	{
		self::exemptions[] = $exemption;
	}

	function checkLoggedIn()
	{
		if(!in_array($_SERVER['REQUEST_URI'], self::exemptions)){
			// check if user logged in, redirect to login page if not
		}
	}

	function hasPermission($page)
	{
		
	}
}