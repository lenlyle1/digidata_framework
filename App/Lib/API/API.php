<?php

namespace Lib\API;

use \Lib\Debug\Debugger;

class API
{
    protected $local = false;

    private $authId = 'superadmin';

    private $authPublic = '128b733a-dffb-4095-b8b3-0075e18bb366';

    public function __construct($authId = null, $authPublic = null, $local = false)
    {
        if (!$local && !$this->authenticate($authId, $authPublic)) {
            $this->sendResponse(['success' => false, 'error' => 'Not authorised']);
        }
    }

    public function createKey($string)
    {
        return password_hash($string, PASSWORD_DEFAULT);
    }

    public function createToken($privateKey)
    {
        //return password_hash($privateKey, PASSWORD_DEFAULT);
        return bin2hex(random_bytes(12));
    }

    protected function authenticate($authId, $authPublic)
    {
        return true;
    }

    public function sendResponse($result)
    {

        if ($this->local) {
            return $result;
        } else {
            // send the response
            header('Content-Type: application/json');

            echo json_encode($result);

            exit();
        }
    }
}