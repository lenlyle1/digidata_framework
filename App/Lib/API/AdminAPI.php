<?php

namespace Lib\API;

use \Lib\Auth\Auth;
use \Lib\User\User;
use \Lib\Debug\Debugger;

class UserAPI extends API
{
    public function __construct($authId = null, $authPublic = null, $local = false)
    {
        parent::__construct($authId, $authPublic, $local);
    }

    public function loadUsers($id = null)
    {
        $result = User::load($id);

        return $this->sendResponse($result);
    }

    public function saveUser($params)
    {
        $result = User::save($params);

        return $this->sendResponse($result);
    }

    public function login($params)
    {
        $result = Auth::attempt($params['username'], $params['password']);

        return $this->sendResponse($result);
    }
}