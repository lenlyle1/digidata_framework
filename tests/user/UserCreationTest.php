<?php

namespace Test;

use Models\Users as UserModel;
use Lib\User\User;

class UserCreationTest extends \PHPUnit\Framework\TestCase  
{

	use \Lib\Seeding\Traits\FlushTable;

	public function testUserCreation()
	{
		$params = [
			'username' 	=> 'lenlyle1',
			'password' 	=> 'T3mpP4ss',
			'email'		=> 'lenlyle1@gmail.com',
			'gender'    => 'm'
		];

        $user = new User();
		$response = $user->save($params);
        $this->assertTrue($response['success']);
	}

	protected function tearDown()
    {
		// users
		$user = new UserModel();
		$this->flushTable($user->table);
    }
}