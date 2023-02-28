<?php

namespace Controllers;

use \Routing\Router;

$router->addGroup('/auth', function($router){
    $router->add( 'POST', '/signin', 'AuthController:signin', 'signin' );
})->addMiddleWare('before',  'GuestMiddleware:run');

$router->addGroup('/auth', function($router){
    $router->add( 'GET',  '/signout', 'AuthController:signout', 'signout' );
})->addMiddleWare('before',  'AuthMiddleware:run');

