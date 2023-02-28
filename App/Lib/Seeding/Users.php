<?php

namespace Lib\Seeding;

use Models\User as UserModel;
use Models\UserEmail as UserEmailModel;
use Models\UserImage as UserImageModel;
use Models\UserProfile as UserProfileModel;
use Lib\User\Keys;
use Lib\Files\Curl;
use Lib\ImageTools\Image;
use Lib\Utils\Debugger;
use Lib\Seeding\User;
use Lib\Seeding\UserImages;
use Lib\Seeding\UserEmail;

Class Users
{
	use \Lib\Seeding\Traits\FlushTable;
	use \Lib\Seeding\Traits\FlushImages;

	public function seed($count = 2)
	{
		Debugger::debug('seeding users');
		$genders = ['male', 'female'];

		$this->flushTables();
		$this->flushImages('profile-pics');

		for($i = 0; $i < $count; $i++){
			$gender = array_rand($genders);

			$user = new User($gender);
			$userModel = $user->seedUser();

			Debugger::debug('pre email');
			$userEmail = new UserEmail();
			Debugger::debug('email created');
			$userEmail->seedEmail($userModel);
			Debugger::debug('email seeded');

			$userImages = new UserImages($gender);
			$userImages->seedImage($userModel);

			$userProfile = new UserProfile($gender);
			$userProfile->seed($userModel);
		}
	}

	private function flushTables()
	{
		// users
		$user = new UserModel();
		$this->flushTable($user->table);

		// user_emails
		$userEmail = new UserEmailModel();
		$this->flushTable($userEmail->table);

		// user_images
		$userImage = new UserImageModel();
		$this->flushTable($userImage->table);

		//user_profiles		
		$userProfile = new UserProfileModel();
		$this->flushTable($userProfile->table);
	}
}