<?php

namespace Lib\API;

use \Lib\User\Group;
use \Lib\Translate\Language;
use \Lib\Debug\Debugger;

class GroupAPI extends API
{
    public function __construct($authId = null, $authPublic = null, $local = false)
    {
        parent::__construct($authId, $authPublic, $local);
    }

    public function save($params)
    {
        Debugger::debug($params);

        $result = Group::save($params);

        return $this->sendResponse($result);
    }

    public function load($groupId = null)
    {
        $result = Group::load($groupId);

        return $this->sendResponse($result);
    }

    public function loadMembers($groupId)
    {
        $result = Group::loadMembers($groupId);

        return $this->sendResponse($result);
    }

    public function addUser($params)
    {
        $result = Group::addMember($params);

        return $this->sendResponse($result);
    }

    public function removeUser($params)
    {
        $result = Group::removeMember($params['user_id'], $params['group_id']);

        return $this->sendResponse($result);
    }

    public function addNote($params)
    {
        $result = Group::addNote($params['user_id'], $params['group_id'], $params['note_title'], $params['note_body']);

        return $this->sendResponse($result);
    }

    public function deleteNote($params)
    {
        $result = Group::deleteNote($params['group_note_id']);

        return $this->sendResponse($result);
    }

    public function saveMessage($params)
    {
        $result = Group::saveMessage($params);

        return $this->sendResponse($result);
    }
}
