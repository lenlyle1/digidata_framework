<?php
/** ========================================================
 *  ORM.php
 *
 *  Description: Very simple ORM to automate basic
 *  DB tasks for Models
 * =======================================================*/
namespace Lib\Database\Mysql\ORM;

use \Lib\Database\DbGetter;
use \Lib\Debug\Debugger;

abstract Class ORM
{
    protected $db;

    protected $idField;

    protected $table = '';

    protected $values = [];

    /** ========================================================
     *  Constructor
     *
     *  Optional setValues() on construct
     * =======================================================*/
    public function __construct($values = null)
    {
        $this->db = DbGetter::getDb();

        if (empty($this->idField)) {
            $this->idField = $this->table . '_id';
        }

        if ($values) {
            $this->setValues($values);
        }
    }

    /** ========================================================
     *  Function: get()
     *
     *  @params: string $name
     *  @returns string
     * =======================================================*/

    public function get($name)
    {
        return $this->values[$name];
    }

    /** ========================================================
     *  Function setValues
     *
     *  @params: array $values
     * =======================================================*/
    public function setValues($values)
    {
        foreach ($values as $field => $value) {
            $this->setValue($field, $value);
        }
    }

    /** ========================================================
     *  Function: setValue()
     *
     *  @params: string $name, string $value
     * =======================================================*/
    public function setValue($name, $value)
    {
        $this->values[$name] = $value;
    }

    /** ========================================================
     *  Function save()
     *
     *  @params: boolean $forceInsert
     *  @returns integar
     * =======================================================*/
    public function save($forceInsert = false)
    {
        $fieldCount = 0;
        $values = [];

        if(empty($this->values[$this->idField]) || $forceInsert){
            //insert into table
            $sql = "INSERT INTO `{$this->table}`
                    (";
            foreach($this->values as $field => $value){
                $fieldCount++;
                $sql .= '`' . $field . '`' . (($fieldCount < (count((array) $this->values))) ? ", " : "");
                $values[] = $value;
            }
            $sql .=  ") VALUES ( " .
                        str_repeat('?, ', $fieldCount - 1) . '?'
                  . ")";
        } else {
            // update table
            $sql = "UPDATE `{$this->table}` SET ";

            $addcomma = false;

            foreach($this->values as $field => $value){
                if ($field != $this->idField) {
                    $sql .= (($addcomma) ? ", " : "" ) . "`{$field}` = ? ";
                    $values[] = $value;
                    $addcomma = true;
                }
            }

            $values[] = $this->values[$this->idField];

            $sql .= "WHERE `{$this->idField}` = ?";
        }

        return $this->db->insertUpdate($sql, $values);
    }

    /** ========================================================
     *  Function getOne()
     *
     *  @params: string $field, string $value
     *  @returns object
     * =======================================================*/
    public function getOne($field = null, $value)
    {
        if(empty($field)){
            $field = $this->table . '_id';
        }

        $sql = "SELECT *
                FROM {$this->table}
                WHERE `$field` = ?";

        return $this->db->fetchOne($sql, [$value]);
    }

    /** ========================================================
     *  Function getAll
     *
     *  @params: integar $offset, integar $count, string $orderBy
     *  @returns array
     * =======================================================*/
    public function getAll($offset = 0, $count = 20, $orderBy = null, $field = null, $value = null)
    {
        $params = [];

        $sql = "SELECT *
                FROM {$this->table} ";

        if ($field && $value) {
            $sql .= "WHERE {$field} = ? ";
            $params = [$value];
        }
        if ($orderBy) {
            $sql .= "ORDER BY {$orderBy} ASC ";
        }

        $sql .= "LIMIT {$offset}, {$count} ";

        return $this->db->fetchAll($sql, $params);
    }

    /** ========================================================
     *  Function emptyTable()
     *
     *  @params: string $field, string $value
     * =======================================================*/
    public function emptyTable($field = null, $value = null)
    {
        // Only run in dev mode!
        if (IS_LIVE) {
            Debugger::debug('Cannot run in live mode');
            return;
        }

        $params = [];

        $sql = "DELETE FROM `{$this->table}` ";

        if ($field && $value) {
            $sql .= "WHERE " . $field . " = ?";
            $params[] = $value;
        }

        $this->db->runQuery($sql, $params);
    }
}