<?php

namespace Lib\Seeding;

use Models\User;
use Models\UserEmail as Email;
use Lib\Utils\Debugger;

Class UserEmail extends FakerShared
{	
	public function seedEmail(User $user)
	{
		Debugger::debug('Seeding email');
		$userEmail = new Email();

		$userEmail->set('user_id', $user->get('id'));
		$userEmail->set('email', $this->faker->freeEmail);
		$userEmail->set('primary', 1);

		$userEmail->save();
	}
}