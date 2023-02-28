<?php

use \Lib\Session\Session;
use \Lib\Smarty\Template;
use \Lib\Debug\Debugger;

if ($errors = Session::get('errors')) {
    Template::assign('errors', $errors);
    Session::wipe('errors');
}

if ($old = Session::get('old')) {
    Template::assign('old', $old);
    Session::wipe('old');
}


if(!empty($_SESSION['messageStack'])){
    Template::assign('messages', $_SESSION['messageStack']);
    Session::wipe('messageStack');
}