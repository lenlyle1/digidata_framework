<?php

namespace Test;

use Models\User as UserModel;
use Lib\Validation\UserValidation;

class UserValidationTest extends \PHPUnit\Framework\TestCase  
{

	public function testEmailValidationFail()
	{
		$email = 'lenlyle@gmail';

		$validation = new UserValidation();
		$result = $validation->testEmail($email);

		$this->assertFalse($result);
	}

	public function testEmailValidation()
	{
		$email = 'lenlyle@gmail.com';

		$validation = new UserValidation();
		$result = $validation->testEmail($email);

		$this->assertTrue($result);
	}
	
	public function testUsernameValidationFail()
	{
		$username = 'lenlyle';
		$requiredLength = 10;

		$validation = new UserValidation();
		$result = $validation->length($username, $requiredLength);

		$this->assertFalse($result);
	}

	public function testUsernameValidation()
	{
		$username = 'lenlyle72';
		$requiredLength = 8;

		$validation = new UserValidation();
		$result = $validation->length($username, $requiredLength);

		$this->assertTrue($result);
	}
	
	public function testPasswordValidationFail()
	{
		$password = 'badpass';
		$requiredLength = 8;

		$validation = new UserValidation();
		$result = $validation->length($password, $requiredLength);

		$this->assertFalse($result);
	}

	public function testPasswordValidation()
	{
		$password = 'G00dP4ss';
		$requiredLength = 8;

		$validation = new UserValidation();
		$result = $validation->length($password, $requiredLength);

		$this->assertTrue($result);
	}
}