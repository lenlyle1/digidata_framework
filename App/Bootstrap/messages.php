<?php

use \Lib\Session\Session;
use \Lib\Smarty\Template;
use \Lib\Debug\Debugger;
use \Lib\Messaging\MessageRunner;

if ($old = Session::get('old')) {
    Template::assign('old', $old);
    Session::wipe('old');
}

// Debugger::debug($_SESSION['messageStack']);
if(!empty($_SESSION['messageStack'])){
    foreach ($_SESSION['messageStack'] as $type => $messages) {
        Debugger::debug($messages, 'Assigning ' . $type . ' to Template');
        Template::assign($type, $messages);
    }

    MessageRunner::clearMessages();
}