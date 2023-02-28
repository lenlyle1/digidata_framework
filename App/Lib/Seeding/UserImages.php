<?php

namespace Lib\Seeding;

use Models\User;
use Models\UserImage;
use Lib\ImageTools\Image;
use Lib\Utils\Debugger;
use Lib\Utils\Paths;

Class UserImages extends FakerShared
{
	protected $gender;

	public function __construct($gender)
	{
		$this->gender = $gender;
		$this->faker = \Faker\Factory::create();
	}

	public function seedImage(User $user)
	{
		$file = $this->faker->imageUrl(600, 400, 'people');

		$image = new Image($file);
		$imageName = $image->makeHashName($file, $user->get('id'));

		$imageDir = Paths::getPath('image', ['profile-pics', 'original']) . 
					Paths::makeSubdir($imageName);
				
		if(!is_dir(PUBLIC_ROOT . $imageDir)){
			Debugger::debug('creating ' . PUBLIC_ROOT . $imageDir);
			mkdir(PUBLIC_ROOT . $imageDir, 0777, true);
		}

		$image->save(PUBLIC_ROOT . $imageDir . $imageName);

		$thumbnail = $this->seedThumbnail($image, $imageDir, $imageName);

	    // update the database
		$userImage = new UserImage();
		$userImage->set('user_id', $user->get('id'));
		$userImage->set('image_url', $imageDir . $imageName);
		$userImage->set('thumbnail', $thumbnail);
		$userImage->set('main_image', 1);
		$userImage->save();

		dump($userImage);
	}

	public function seedThumbnail(Image $image, $imageDir, $imageName)
	{
		dump($imageDir);
		dump($imageName);
		$filename = explode('.', $imageName)[0];
		$filenameThumb = $filename . '-thumb.jpg';
		dump('creating thumbnail - ' . $filenameThumb);
		// thumbnail
		dump($image);
		$imageX = $image->imageInfo[0];
		$imageY = $image->imageInfo[1];
		if($imageX < $imageY) {
			$width = $imageX;
			$x = 0;
			$y = $imageY / 2 - $width / 2;
		} else {			
			$width = $imageY;
			$y = 0;
			$x = $imageX / 2 - $width / 2;
		}

		$image->crop($x, $y, $width, $width, PUBLIC_ROOT . $imageDir . $filenameThumb);

		return $imageDir . $filenameThumb;
	}
}