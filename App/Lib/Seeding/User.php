<?php

namespace Lib\Seeding;

use Models\User as UserModel;
use Lib\Utils\Debugger;
use Lib\User\Keys;

Class User
{
	private $gender;

	public function __construct($gender)
	{
		$this->gender = $gender;
		$this->faker = \Faker\Factory::create();
	}

	public function seedUser()
	{
		
		$user = new UserModel();

		$user->set('username', $this->faker->userName($this->gender));
		//$user->set('email', $this->faker->freeEmail);
		$user->set('password', UserModel::hashPassword("Scr0tums"));
		$user->set('gender', $this->gender);
		$user->set('created_ts', date("Y-m-d H:i:s"));
		$user->set('fake', 1);

		$user->set('secret_key', Keys::createSecret($user));
		$user->set('public_key', Keys::createPublic($user));

		$user->save();

		return $user;
	}
}