<?php

namespace Lib\API;

use \Lib\User\UserRole\Roles;
use \Lib\User\UserRole\Permissions;
use \Lib\Debug\Debugger;

class RolesAPI extends API
{
    public function __construct($authId = null, $authPublic = null, $local = false)
    {
        parent::__construct($authId, $authPublic, $local);
    }

    public function loadRoles($roleId = null, $start = 0, $count = 20)
    {
        $result = Roles::load($roleId);

        return $this->sendResponse($result);
    }


    public function loadPermissions($permissionId = null, $start = 1, $count = 20)
    {
        $result = Permissions::load($permissionId);

        return $this->sendResponse($result);
    }

    public function saveRoles($params)
    {
        Debugger::debug($params);
        $result = Roles::save($params['role_name']);

        return $this->sendResponse($result);
    }

    public function savePermission($params)
    {
        $result = Permissions::save($params);

        return $this->sendResponse($result);
    }

    public function assignPermissions($params)
    {
        $result = Permissions::assignToRole($params['permission_id'], $params['role_id']);

        return $this->sendResponse($result);
    }

    public function assignToUser($params)
    {
        $result = Roles::assignToUser($params['user_id'], $params['role_id']);

        return $this->sendResponse($result);
    }
}