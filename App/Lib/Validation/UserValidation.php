<?php

namespace Lib\Validation;

use \Lib\Debug\Debugger;
use \Lib\Database\DbGetter;
use \Models\Users as UserModel;

class UserValidation extends Validation
{
    public function validate($params, $requiredFields = null)
    {
        $this->validateUser($params, $requiredFields['user']);

        Debugger::debug($requiredFields);
        Debugger::debug($this->errors);

        return $this->processResult();
    }

    public function validateUser($params, $requiredFields = null)
    {
        Debugger::debug($requiredFields);
        $this->checkRequired($requiredFields, $params);

        if (!empty($params['userId'])) {
            $userModel = new UserModel();
            $user = $userModel->getOne('user_id', $params['userId']);
        }

        $req = [
            'check_username' => true,
            'check_email' => true,
            'check_password' => true,
        ];

        Debugger::debug($params);
        Debugger::debug($user);
        if (!empty($user)) {
            if($params['username'] == $user->username) {
                $req['check_username'] = false;
            }
            if ($params['email_address'] == $user->email_address) {
                $req['check_email'] = false;
            }
            if (empty($params['password'])) {
                $req['check_password'] = false;
            }
        }

        if(empty($params['username'])){
            $req['check_username'] = false;
        }

        if(empty($params['email_address'])){
            $req['check_email'] = false;
        }

        if(empty($params['password'])){
            $req['check_password'] = false;
        }

        Debugger::debug($user);
        Debugger::debug($params);
        Debugger::debug($req);

        if($req['check_username'] && $params['username'] != ''){
            // check username not subscribed
            if ($this->fieldInDb('users', 'username', $params['username'])) {
                $this->setError('username', 'Username already subscribed');
            }
        }

        if($req['check_email'] && $params['email_address'] != '') {
            // check email valid and not subscribed
            Debugger::debug('checking email');
            if($params['email_address'] != ''){
                if (!$this->testEmail($params['email_address'])){
                    $this->errors['email_address'][] = 'Invalid Email Address';
                }
                // if ($this->fieldInDb('User', 'email_address', $params['email_address'])) {
                //     $this->errors['email_address'][] = 'Email already subscribed';
                // }
                // if ($params['email_address'] != $params['confirm_email'] && empty($params['import'])) {
                //     $this->errors['confirm_email'][] = 'Email addresses do not match';
                // }
            }
        }

    }

    function checkIsAValidDate($myDateString){
        return (bool)strtotime($myDateString);
    }
}