<?php

namespace Lib\User;

use \Lib\Debug\Debugger;
use \Lib\Database\DbGetter;// use \Models\UserContactInformation;
use \Lib\Validation\UserValidation;
use \Lib\Messaging\MessageRunner;

class User
{
    use Traits\UserProfileTrait;

    public static function save($params)
    {
        $db = DbGetter::getDB();

        // Validate submitted fields
        $validator = new UserValidation();
        $validationResult = $validator->validate($params);

        if (!$validationResult['success']) {
            Debugger::debug($validationResult, 'User validation result');
            return $validationResult;
        }

        $userParams = [
            ':username' => $params['username'],
            ':password' => password_hash($params['password'], PASSWORD_DEFAULT),
            ':email_address' => $params['email_address']
        ];

        $sql = "INSERT INTO users (
                    username,
                    password,
                    email_address
                ) VALUES (
                    :username,
                    :password,
                    :email_address
                )
                ON DUPLICATE KEY UPDATE
                    email_address = :email_address
                ";

        $params['user_id'] = $db->insertUpdate($sql, $userParams);


        // save role
        self::saveUserRole($params['user_id'], $params['user_role']);

        // create profile when we have more info about requirements

        if($params['user_role'] != 'superadmin'){
            self::saveProfile($params);
        }

        return ['success' => true, 'user_id' => $params['user_id']];
    }

    public static function saveUserRole($userId, $role)
    {
        Debugger::debug('Saving user role');
        $db = DbGetter::getDb();

        $sql = "INSERT IGNORE INTO user_role (
                    user_id, role_id
                ) VALUES (
                    ?, (SELECT role_id
                        FROM roles
                        WHERE role_name = ?)
                ) ";

        Debugger::debug([$userId, $role]);
        $db->insertUpdate($sql, [$userId, $role]);
    }

    public static function load($userId = null, $username = null, $email = null)
    {
        $sql = "SELECT u.user_id as user_id, u.password, u.username, u.email_address, 
                       up.time_zone_id, up.first_name, up.last_name, up.home_phone, up.mobile_phone,
                       g.gender,
                       r.role_name,
                       l.*
                FROM users AS u
                LEFT JOIN user_profile AS up USING (user_id)
                LEFT JOIN gender AS g USING (gender_id)
                LEFT JOIN user_role AS ur USING (user_id)
                LEFT JOIN roles AS r USING (role_id)
                LEFT JOIN languages AS l USING (language_id) 
                LEFT JOIN time_zones AS t USING (time_zone_id) ";

        if ($userId) {
            $sql .= "WHERE u.user_id = ? ";
            $params = [$userId];
            $method = 'fetchOne';
        } else if($email) {
            $sql .="WHERE u.email_address = ? ";
            $params = [$email];
            $method = 'fetchOne';
        } else if($username) {
            $sql .="WHERE u.username = ? ";
            $params = [$username];
            $method = 'fetchOne';
        } else {
            $sql .= "WHERE r.role_name = ?";

            //$sql .= "LIMIT " . $start . ", " . $size;
            $params = [$userRole];
            $method = 'fetchAll';
        }

        $db = DbGetter::getDb();
        $result = $db->$method($sql, $params);

        Debugger::debug($result);

        if($result) {
            if ($userId || $email || $username){
                $result->date_of_birth = date('m/d/Y', strtotime($result->date_of_birth));
                $result->hasPassword = ($result->password == '') ? false : true;
            } else {
                foreach($result as $id => $user) {
                    $result[$id]->height_feet = floor($user->height / 12);
                    $result[$id]->height_inches = $user->height % 12;
                    if(!empty($user->date_of_birth)) {
                        $result[$id]->date_of_birth = date('m/d/Y', strtotime($user->date_of_birth));
                    }
                }
            }

            unset($result->password);

            return [
                'success' => true,
                'payload' => $result
            ];
        } else {
            return [
                'success' => false,
                'errors' => ['That username could not be found']
            ];
        }

    }

    public static function loadAll()
    {
        $db = DbGetter::getDb();

        $sql = "SELECT *
                FROM users AS u
                LEFT JOIN user_profile USING (user_id)
                LEFT JOIN user_role USING (user_id)
                LEFT JOIN roles USING (role_id)";

        $users = $db->fetchAll($sql);

        return $users;
    }

    public static function updatePassword($username = null, $password = null, $confirmPassword = null)
    {
        if ($password != $confirmPassword) {
            MessageRunner::addMessage('error', 'Confirm password does not match');
            return false;
        }

        $db = DbGetter::getDb();

        $params = [
            ':user_id' => $user->user_id
        ];

        $sql = "UPDATE user SET ";

        if($username) {
            $validation = new \Lib\Validation\UserValidation();
            // check username not already in db
            if ($validation->fieldInDb('User', 'username', $username)) {
                $validation->setError('username', 'Username already subscribed');
                MessageRunner::addMessage('error', ['username' => 'Username already subscribed']);
                return false;
            }
            $sql .= "username = :username" . (($password) ? ', ' : ' ');
            $params[':username'] = $username;
        }
        if($password){
            $sql .= "password = :password ";
            $params[':password'] = password_hash($password, PASSWORD_DEFAULT);
        }

        $sql .= "WHERE user_id = :user_id";

        $db->insertUpdate($sql, $params);

        $_SESSION['user']->username = $username;
        $_SESSION['user']->hasPassword = true;
        return true;
    }

    public static function can($task, $permissions = null)
    {
        return true;

        if (is_array($permissions)) {
            return in_array($task, $permissions);
        }

        return false;
    }
}