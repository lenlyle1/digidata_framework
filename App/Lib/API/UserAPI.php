<?php

namespace Lib\API;

use \Lib\Auth\Auth;
use \Lib\User\User;
use \Lib\Debug\Debugger;
use \Lib\Activities\Activities;
use \Lib\Survey\Quizling;

class UserAPI extends API
{
    public function __construct($authId = null, $authPublic = null, $local = false)
    {
        parent::__construct($authId, $authPublic, $local);
    }

    public function load($id = null, $username = null, $email = null)
    {
        $result = User::load($id, $username, $email);

        return $this->sendResponse($result);
    }

    public function save($params)
    {
        Debugger::debug($params);
        $result = User::save($params);

        return $this->sendResponse($result);
    }

    public function saveProfile($params)
    {
        $result = User::saveProfile($params);

        return $this->sendResponse($result);
    }

    public function login($params)
    {
        $result = Auth::attempt($params['username'], $params['password']);

        return $this->sendResponse($result);
    }

    public function importUsers($params)
    {
        $result = User::importUsers($params);

        return $this->sendResponse($result);
    }

    public function deleteCoach($userId, $coachId, $type)
    {
        $result = User::deleteCoach($userId, $coachId, $type);

        return $this->sendResponse($result);
    }

    public function loadMotivationalPrompt($promptId)
    {
        $result = Activities::fetchMotivation(null, $promptId);

        return $this->sendResponse($result);
    }

    public function loadQuestionsAndAnswers($batchId)
    {
        $result = Quizling::loadQuestionsAndAnswers($batchId);

        return $result;
    }
}