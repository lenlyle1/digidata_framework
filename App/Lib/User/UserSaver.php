<?php

namespace Lib\User;

use \Models\User as UserModel;
use \Lib\Debug\Debugger;
use \Lib\Database\DbGetter;

class UserSaver
{
    public static function saveUser($params)
    {
        $db = DbGetter::getDb();

        $values = [];
        // Validation good, save the user. if user_id, update
        if ($params['user_id']) {
            $values[':user_id'] = $params['user_id'];
        } else {
            $result = $db->fetchOne('SELECT get_uid() AS user_id');
            $values[':user_id'] = $result->user_id;
        }

        $values[':unique_identifier'] = self::createUniqueKey($values[':user_id']);
        $values[':email_address'] = $params['email_address'];
        $values[':username'] = $params['username'];
        $values[':test_user'] = (!empty($_POST['test_user'])) ? $_POST['test_user'] : 0;
        $values[':time_zone_id'] = $params['time_zone'];
        if (!empty($params['password'])) {
            $values[':password'] = password_hash($params['password'], PASSWORD_DEFAULT);
        }

        $sql = "INSERT INTO user (
                    user_id,
                    unique_identifier,
                    email_address,
                    username,
                    test_user,";
        if(!empty($params['password'])){
            $sql .= "password, ";
        }
        $sql .= "time_zone_id
                ) VALUES (
                    :user_id,
                    :unique_identifier,
                    :email_address,
                    :username,
                    :test_user, ";
        if(!empty($params['password'])){
            $sql .= ":password, ";
        }
        $sql .= ":time_zone_id
                ) ON DUPLICATE KEY UPDATE
                    email_address = :email_address,
                    username = :username, ";
        if(!empty($params['password'])){
            $sql .= "password = :password, ";
        }
        $sql .= "time_zone_id = :time_zone_id, test_user = :test_user";

        Debugger::debug($sql);

        $db-> insertUpdate($sql, $values);



        return $values[':user_id'];


    }

    public static function createUniqueKey($userId)
    {
        if($user->unique_identifier == ''){
            $uniq = false;
            $userModel = new UserModel();
            $str = substr(md5($userId), 1, 8);

            $db = DbGetter::getDb();

            while($uniq === false) {

                if(!$userModel->getOne('unique_identifier', $str)){
                    return $str;
                }

                $str = substr(md5($userId . chr(rand(65,90)) . chr(rand(65,90))), 1, 8);
            }
        }
    }
}