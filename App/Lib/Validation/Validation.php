<?php

namespace Lib\Validation;

use \Lib\Debug\Debugger;
use \Lib\Database\DbGetter;

abstract class Validation
{
    protected $errors = [];

    public function setError($field, $error)
    {
        $this->errors[$field][] = $error;
    }

    public function fieldInDb($tableName, $fieldName, $value)
    {
        $db = DbGetter::getDb();

        $sql = "SELECT * FROM $tableName
                WHERE $fieldName = ?";

        if($db->fetchOne($sql, [$value]) == null){
            return false;
        }

        return true;
    }

    public function formatFieldName($fieldName)
    {
        return str_replace('_', ' ', ucwords($fieldName));
    }

    protected function notEmpty($value)
    {
        if ($value == '') {
            return false;
        }

        return true;
    }

    public function testEmail($email)
    {
        $result = filter_var($email, FILTER_VALIDATE_EMAIL);

        // Debugger::debug($result);
        if (empty($result)) {
            $this->setError('email_address', 'Invalid email format');
            return false;
        }

        return true;
    }

    public function length($value, $length)
    {
        return strlen($value) >= $length;
    }

    public  function checkRequired($requiredFields, $params)
    {
        if(!empty($requiredFields)){
            foreach ($requiredFields as $field) {
                if(!$this->notEmpty($params[$field])){
                    Debugger::debug($field . ' empty');
                    $this->setError($field, $this->formatFieldName($field) . ' is required');
                }
            }
        }
    }

    public function processResult()
    {
        if ($this->errors) {
            return [
                'success' => false,
                'errors' => $this->errors
            ];
        } else {
            return [
                'success' => true
            ];
        }
    }
}