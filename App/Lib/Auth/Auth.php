<?php

namespace Lib\Auth;

use \Models\User as UserModel;
use \Models\UserPatientDetails as UserPatientDetailsModel;
use \Lib\Debug\Debugger;
use \Lib\Database\DbGetter;
use \Lib\Messaging\MessageRunner;

class Auth
{
    public static function attempt($username, $password)
    {
        $db = DbGetter::getDb();

        $sql = "SELECT u.user_id, u.password
                FROM user AS u
                LEFT JOIN user_patient_details AS upd
                    ON u.user_id = upd.user_id
                WHERE u.username = ?
                OR upd.mrn = ?";

        $user = $db->fetchOne($sql, [$username, $username]);

        Debugger::debug($user);

        if (!$user) {
            MessageRunner::addMessage('flash', 'Could not log you in with those details');
            Debugger::debug('User not found');
            return false;
        }

        # Verify password for user:
        Debugger::debug('Verifying password: ' . $password);
        if (password_verify($password, $user->password)) {
            return ['success' => true, 'user_id' => $user->user_id];
        } else {
            MessageRunner::addMessage('flash', 'Could not log you in with those details');
            return ['success' => false];
        }

        return false;
    }

    public static function signout()
    {
        session_destroy();
    }

    public static function signinPatient($userId)
    {
        return \Lib\User\User::load(null, $userId);
    }
}