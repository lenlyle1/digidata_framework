<?php

namespace Lib\Utils;

use \Lib\User\User;

class Site
{
    public static function setup()
    {
        if(IS_LIVE){
            die('Cannot be run in LIVE mode');
        }

        echo "wiping tables";
        self::resetDb();

        // create users
        self::createUser([
            'email_address' => 'len@ieqtechnology.com',
            'username' => 'superadmin',
            'password' => 'test',
            'time_zone' => 11
        ]);

        $userModel = new \Models\Users;
        $user = $userModel->getOne('username', 'superadmin');
        User::saveUserRole($user->user_id, 'superadmin');
    }

    public static function createUser($params)
    {
        \Lib\User\UserSaver::saveUser($params);
        // $userModel = new \Models\User;

        // $userModel->setValues($params);
        // $userModel->save();
    }

    public static function resetDb()
    {
        $models = [
            'GroupNote',
            'GroupMessage',
            'Groups',
            'UserRole',
            'UserQuestionResponse',
            'UserProfile',
            'UserGroup',
            'UserEvaluationBatch',
            'UserCompletedEvaluation',
            'UserCoachProvider',
            'UserPatientDetails',
            'UserProfile',
            'User',
            'Practice',
            'MotivationalPrompts',
            'MotivationalPromptLog',
            'UserEvaluationBatch',

        ];

        foreach($models as $model){
            \Lib\Debug\Debugger::debug('Emptying ' . $model);

            $class = '\Models\\' . $model;
            $entity = new $class;
            $entity->emptyTable();
        }
    }
}