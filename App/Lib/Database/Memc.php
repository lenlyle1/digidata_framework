<?php

namespace Lib\Database;

use \Lib\Database\DbGetter;
use \Lib\Debug\Debugger;

Class Memc
{
    private static $memc = null;

    private static $server = null;

    private static $port = null;

    public function __construct($server, $port)
    {
        self::addServer($server, $port);
    }

    public static function getInstance()
    {
        if(!self::$memc){
            self::init();
        }

        return self::$memc;
    }

    public static function addServer($server, $port)
    {
        self::$server = $server;
        self::$port = $port;
    }

    public static function init()
    {
        if(!self::$server && !self::$port){
            // die, change to clean handling later
            //echo self::$server .' '. self::$port;
            echo('cache not configured');
        }

        try{
            self::$memc = new \Memcached();
            self::$memc->setOption(\Memcached::OPT_LIBKETAMA_COMPATIBLE, true);
            self::$memc->addServer(self::$server, self::$port);
        } catch(Exception $e){
            die('Failed to init memcached');
        }
    }

    public static function getAllKeys()
    {
        return self::$memc->getAllKeys();
    }

    public static function fetch($sql, $params, $action, $expire = 5, $key = null)
    {
        $memc = self::getInstance();

        if(empty($key)){
            $key = self::buildKey($sql, $params);
        }

        //self:: flush();

        if(!$data = $memc->get($key)){
            Debugger::debug($key, 'Memc key not found: ', false, 'memcache');
            $db = DbGetter::getDb();

            $data = $db->$action($sql, $params);
            //$memc->set('test', 25423452345345);
            Debugger::debug($sql, 'SQL', false, 'memcache');
            Debugger::debug($params, 'PARAMS', false, 'memcache');
            Debugger::debug($action, 'ACTION', false, 'memcache');
            Debugger::debug($data, 'DATA', false, 'memcache');
            $memc->set($key, $data, $expire);
        } else {
            Debugger::debug($key, 'Memc loading data for key: ', false, 'memcache');
            Debugger::debug($data, 'Data from cache:', false, 'memcache');
        }

        return $data;
    }

    public static function save($key, $data, $expire = 5)
    {
        $memc = self::getInstance();
        $memc->set($key, $data, $expire);
    }

    private static function buildKey($sql, $params = null)
    {
        $key = $sql;

        if($params){
            foreach($params as $k => $v){
                $key .= $k . '|' . $v;
            }
        }

        return md5($key);
    }

    public static function flush($key = null)
    {
        $memc = self::getInstance();

        if($key) {
            $memc->delete($key);
        } else {
            $memc->flush();
        }
    }
}
