<?php

namespace Lib\User\UserRole;

use \Models\Roles;
use \Models\UserRole;
use \Lib\Database\DbGetter;
use \Lib\Debug\Debugger;

class Roles
{
    public static function load($roleId = null)
    {
        $roleModel = new Role();

        if (!empty($roleId)) {
            $roles = $roleModel->getOne('role_id', $roleId);
        } else {
            $roles = $roleModel->getAll();
        }
        // Debugger::debug($roles);
        return $roles;
    }

    public static function save($roleName)
    {
        $roleModel = new Role();
        if ($roleModel->getOne('role_name', $roleName)) {
            return [
                'success' => false,
                'error' => 'Role name already in use'
            ];
        }

        $roleModel->setValues(['role_name' => $roleName]);
        $roleModel->save();

        return [
            'success' => true
        ];
    }

    public static function loadPermissions($roleId)
    {
        $db = DbGetter::getDb();

        $sql = "SELECT p.*
                FROM permission AS p
                LEFT JOIN role_permission AS rp
                    ON p.permission_id = rp.permission_id
                WHERE rp.role_id = ?";

        $permissions = $db->fetchAll($sql, [$roleId]);

        $rolePermissions = [];

        foreach ($permissions as $permission) {
            $rolePermissions[$permission->permission_id] = $permission->permission_name;
        }

        return $rolePermissions;
    }

    public static function wipePermissions($roleId)
    {
        $db = DbGetter::getDb();

        $sql = "DELETE FROM role_permission
                WHERE role_id = ?";

        $db->runQuery($sql, [$roleId]);
    }

    public static function assignToUser($userId, $roleId)
    {
        $userRole = new UserRole([
            'role_id' => $roleId,
            'user_id' => $userId
        ]);

        return $userRole->save();
    }


}