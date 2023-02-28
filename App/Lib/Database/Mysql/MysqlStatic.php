<?php

namespace App\Lib;

Class Mysql{

    private static $db = null;

    private static $dbHost;

    private static $dbName;

    private static $dbUser;

    private static $dbPass;

    private static function connect()
    {
        try{
            self::$db = new \PDO('mysql:host=' . self::$dbHost . ';dbname=' . self::$dbName . ';charset=utf8', self::$dbUser, self::$dbPass);
            self::$db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e){
            Debugger::debug('error');
            Errors::handle($e, 'sqlerr');
        }
    }

    public static function getDB()
    {
        if(empty(self::$db)){
            self::connect();
        }
        return self::$db;
    }

    public function beginTransaction()
    {
        return PDO::beginTransaction();
    }

    public function rollBack()
    {
        return PDO::rollback();
    }

    public function commitTransaction()
    {
        return PDO::rollback();
    }

    public function runQuery($sql, $params = null)
    {
        $db = self::getDB();
        if(empty($db)){
            die('There has been a serious problem');
        }
        $stmt = $db->prepare($sql);
        //Debugger::debug($sql, 'Running SQL');
        try{
            $stmt->execute($params);
        } catch(PDOException $e){
            Errors::handle($e, 'sqlerr');
        }
        return $stmt;
    }

    public function fetchAll($sql, $params = null)
    {
        $stmt = self::runQuery($sql, $params);
        return $stmt->fetchAll(\PDO::FETCH_OBJ);
    }

    public function fetchOne($sql, $params = null)
    {
        $stmt = self::runQuery($sql, $params);
        return $stmt->fetch(\PDO::FETCH_OBJ);
    }

    public function insertUpdate($sql, $params)
    {
        $stmt = self::runQuery($sql, $params);
        return ( int ) self::$db->lastInsertId();
    }

    public function setvar($name, $value)
    {
        self::$$name = $value;
    }
}
