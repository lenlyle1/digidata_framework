<?php

//use App\Lib\Utils\Template;
use Lib\Debug\Debugger;

$router = new App\Routing\Router('/App/Router/Routes');

//$router = new AltoRouter();

//$routeFiles = scandir(ROOT_DIR . '/App/Router/Routes');

// load all routes
// foreach ($routeFiles as $file) {
//     if(strstr($file, '.php')){
//         require_once(ROOT_DIR . '/App/Router/Routes/' . $file);
//     }
// }


// test for route match
$match = $router->match();

if ($match === false) {
    // Invalid route - output 404
    $smarty->display('404/404.tpl');
} else {
    Debugger::debug($match);
    //$match['params']['router'] = $router;
    list( $controller, $action ) = explode( ':', $match['target'] );

    // check the controler and method are callable
    if ( is_callable(array('Controllers\\' . $controller, $action)) ) {

        // Instantiate the controller and call the method
        $classname = '\Controllers\\' . $controller;
        $requestHandler = new $classname();
        $response = $requestHandler->$action($router, $match['params']);

        if($response){
            if(!empty($response['type'])){
                switch ($response['type']) {
                    case 'redirect':
                        header('Location: ' . $response['url']);
                        break;
                    case 'api':
                        echo json_encode($response['payload']);

                }
            } else {
                $smarty->display($response . '.tpl');
                die();
            }
        }
    } else {
        echo 'Controller Error: ' . $controller.':' . $action;
        // here your routes are wrong.
        // Throw an exception in debug, send a  500 error in production
    }
}
