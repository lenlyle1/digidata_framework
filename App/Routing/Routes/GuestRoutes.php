<?php
 /*----------------------------------------------------------
 |  Guest Routes
 ---------------------------------------------------------*/
$router->addGroup('', function($router){

    $router->addGroup('/user', function($router){
        // signup
        $router->add( 'GET',  '/signup', 'UserController:signup', 'user.signup-form');
        $router->add( 'POST',  '/signup', 'UserController:processSignup', 'user.signup');
               // ->addMiddleware('before', 'CsrfMiddleware:authenticate');
    });
    $router->add( 'GET', '/', 'PageController:home', 'home' );

    // pasword reset
    $router->add('GET', '/reset-password', 'UserController:passwordResetForm', 'forgot-password');
    $router->add('POST', '/reset-password', 'UserController:passwordReset', 'forgot-password-reset');
    $router->add('GET', '/forgot-password-form', 'UserController:passwordResetRequestForm', 'forgot-password-form');
    $router->add('POST', '/forgot-password-request', 'UserController:submitPasswordResetRequest', 'forgot-password-reset-request');

});
