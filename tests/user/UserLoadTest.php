<?php

namespace Test;

use \Lib\User\User;
use \Lib\Database\DbGetter;

class UserLoadTest extends \PHPUnit\Framework\TestCase 
{
    public function testUserLoadByEmail()
    {
        $result = User::load(null, null, 'lenlyle@gmail.com');

        $this->assertTrue($result['success']);
    }

    public function testUserLoadByUserName()
    {
        $result = User::load(null, 'lenlyle');

        $this->assertTrue($result['success']);
    }
}