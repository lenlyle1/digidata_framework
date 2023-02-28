<?php

namespace Lib\User\UserRole;

use \Models\Permission;
use \Models\RolePermission;
use \Lib\User\User;
use \Lib\Database\DbGetter;
use \Lib\Debug\Debugger;

class Permissions
{
    public static function load($id = null)
    {
        $permissionModel = new Permission();

        if (!empty($id)) {
            $permissions = $permissionModel->getOne('permission_id', $id);
        } else {
            $permissions = $permissionModel->getAll(0, 200, 'permission_name');
        }

        return $permissions;
    }

    public static function save($permissionName, $permissionDesc)
    {
        $permissionModel = new Permission();

        if (!empty($params['permission_id'])) {
            $permissionModel->setValue('permission_id', $params['permission_id']);
        }

        Debugger::debug($params);

        $permissionModel->setValues([
            'permission_name' => $permissionName,
            'permission_desc' => $permissionDesc
        ]);

        $permissionModel->save();

        return ['success' => true];
    }

    public static function assignToRole($permId, $roleId)
    {
        $rolePermissionModel = new RolePermission([
            'role_id' => $roleId,
            'permission_id' => $permId
        ]);

        $rolePermissionModel->save();

        return ['success' => true];
    }

    public static function loadUserPermissions($user)
    {
        $db = DbGetter::getDb();

        $sql = "SELECT p.permission_name
                FROM permission AS p
                LEFT JOIN role_permission AS rp
                    ON p.permission_id = rp.permission_id
                LEFT JOIN role AS r
                    ON rp.role_id = r.role_id
                WHERE r.role_id = ?";

        $result = $db->fetchAll($sql, [$user->role_id]);

        $permissions = [];
        foreach ($result as $id => $permission) {
            $permissions[] = $permission->permission_name;
        }

        return $permissions;


        //$userRoles = User::getUserRoles($userId);

        // $db = DbGetter::getDb();

        // $sql = "SELECT p.permission_name
        //         FROM permissions AS p
        //         LEFT JOIN role_permissions AS rp
        //             ON p.permission_id = rp.permission_id
        //         LEFT JOIN user_role AS ur
        //             ON ur.role_id = rp.role_id
        //         WHERE ur.user_id = ?
        //         GROUP BY p.permission_name";

        // return $db->fetchAll($sql, [$userId]);
    }
}