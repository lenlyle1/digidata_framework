<?php

namespace Lib\Database\Mysql;

use \Lib\Debug\Debugger;

class DB
{
    private $db;

    private string $dbHost;

    private string $dbPort;

    private string $dbName;

    private string $dbUser;

    private string $dbPass;

    public function __construct(string $dbHost, string $dbPort, string $dbName, string $dbUser, string $dbPass)
    {
        $this->dbHost = $dbHost;
        $this->dbPort = $dbPort;
        $this->dbName = $dbName;
        $this->dbUser = $dbUser;
        $this->dbPass = $dbPass;

        $this->connect();
    }

    private function connect(): void
    {
        try{
            $this->db = new \PDO('mysql:host=' . $this->dbHost . ';port=' . $this->dbPort . ';' .
                                 'dbname=' . $this->dbName . ';charset=utf8', $this->dbUser, $this->dbPass);

            $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e){
            Debugger::debug($e->getMessage());
            //Errors::handle($e, 'sqlerr');
        }
    }

    public function fetchAll(string $sql, array $params = [])
    {
        $stmt = $this->runQuery($sql, $params);

        return $stmt->fetchAll(\PDO::FETCH_OBJ);
    }

    public function fetchOne(string $sql, array $params = [])
    {
        $stmt = $this->runQuery($sql, $params);

        return $stmt->fetch(\PDO::FETCH_OBJ);
    }

    public function insertUpdate(string $sql, array $params = [])
    {
        $stmt = $this->runQuery($sql, $params);

        return ( int ) $this->db->lastInsertId();
    }

    public function upsert(string $sql, array $params = [])
    {
        $stmt = $this->runQuery($sql, $params);
        return ($stmt->rowCount() > 0)? true : false;
    }

    public function runQuery(string $sql, array $params = [])
    {
        if (empty($this->db)) {
            die('There has been a serious problem');
        }

        // write to log when in dev mode
        Debugger::debug($sql, 'SQL', false, 'sqllog');
        Debugger::debug($params, 'VALUES', false, 'sqllog');

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
        } catch (\PDOException $e) {
            Debugger::debug($e->getMessage(), 'SQL Error', true, 'sqlerr');
            Debugger::debug($sql, 'SQL', false, 'sqlerr');
            Debugger::debug($params, 'with params:', false, 'sqlerr');
        }

        // Debugger::debug($stmt->fetchAll(\PDO::FETCH_OBJ), 'Query results', false, 'sqllog');

        return $stmt;
    }

}
