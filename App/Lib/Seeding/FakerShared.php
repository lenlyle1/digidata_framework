<?php
namespace Lib\Seeding;

Abstract Class FakerShared
{
	protected $faker;

	function __construct()
	{
		$this->faker = \Faker\Factory::create();
	}
}
