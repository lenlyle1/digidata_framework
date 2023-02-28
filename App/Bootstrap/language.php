<?php

use \Lib\Session\Session;
use \Lib\Debug\Debugger;
use \Lib\Translate\Language;
use \Lib\Smarty\Template;

if (!Session::get('language')) {
    Session::set('language', 'en');
}

Template::assign('language', Session::get('language'));

// force translations reset
 // unset($_SESSION['translations']);

// if (empty($_SESSION['translations'][Session::get('language')])) {
//     $_SESSION['translations'][Session::get('language')] = Language::loadTranslations(Session::get('language'));
// }

//Debugger::debug(Session::get('translations'), 'TRANSLATIONS', false, 'translationslog');