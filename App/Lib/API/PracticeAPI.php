<?php

namespace Lib\API;

use \Lib\User\Practice;
use \Lib\Translate\Language;
use \Lib\Debug\Debugger;

class PracticeAPI extends API
{
    public function __construct($authId = null, $authPublic = null, $local = false)
    {
        parent::__construct($authId, $authPublic, $local);
    }

    public function savePractice($params)
    {
        Debugger::debug($params);

        $result = Practice::save($params);

        return $this->sendResponse($result);
    }

    public function load()
    {
        $result = Practice::load();

        return $this->sendResponse($result);
    }

}