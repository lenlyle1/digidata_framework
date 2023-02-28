<?php

namespace Lib\User;

Class Validate
{
	public static function validateEmail($email)
	{
		if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
		    return true;
		}

		return false;
	}

	public static function validateUsername($username)
	{		
		if(preg_match('/^[a-z][a-z0-9]{7,31}$/i', $username)){
			return true;
		}

		return false;
	}

	public static function validatePassword($password)
	{	
		if(preg_match('/^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z!@#$%]{8,20}$/', $password)){
			return true;
		}

		return false;
	}
}