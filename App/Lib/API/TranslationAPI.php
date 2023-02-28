<?php

namespace Lib\API;

// use \Lib\User\UserRole\Roles;
// use \Lib\User\UserRole\Permissions;
use \Lib\Translate\Language;
use \Lib\Debug\Debugger;

class TranslationAPI extends API
{
    public function __construct($authId = null, $authPublic = null, $local = false)
    {
        parent::__construct($authId, $authPublic, $local);
    }

    public function updateTranslation($itemKey, $enTxt, $esTxt)
    {
        $result = Language::saveTranslation($itemKey, 'en', $enTxt);
        $result = Language::saveTranslation($itemKey, 'es', $esTxt);

        return $this->sendResponse($result);
    }

}