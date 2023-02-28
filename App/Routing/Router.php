<?php

namespace App\Routing;

use \App\Routing\Exception\RouterException;
use AltoRouter;
use \Lib\Debug\Debugger;
use \Lib\Utils\Redirect;

class Router extends AltoRouter
{
    // protected $routeHandler;

    protected $routePath;

    // protected $routes = [];

    protected $route;

    // protected $groups;

    protected $pathPrefix = null;

    protected $match;

    public function __construct($routePath = null)
    {
        if (!$routePath) {
            throw new RouterException("No route path supplied");
        }
        $this->addMatchTypes(['t' => '[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*']);

        if($routePath){
            $this->routePath = $routePath;
            $this->loadRoutes($routePath);
        }
    }

    public function loadRoutes($routePath)
    {
        $routeFiles = scandir($routePath);

        $router = $this;
        // load all routes
        foreach ($routeFiles as $file) {
            if(preg_match('/Routes\.php/', $file)){
                require_once($routePath . '/' . $file);
            }
        }

        //Debugger::debug($this->routes);
    }

    public function addGroup($group, $callback)
    {
        $prefixBefore = $this->pathPrefix;

        // start a new stack
        if($this->pathPrefix === null) {
            $this->stack = [];
        }

        $this->pathPrefix = $this->pathPrefix . $group;

        $callback($this);

        $this->pathPrefix = $prefixBefore;

        //Debugger::debug($this->stack, 'Stack at end');
        return $this;
    }

    public function add($methods, $route, $controller, $name = null)
    {
        // if not in group, clear the stack
        if ($this->pathPrefix === null) {
            $this->stack = [];
        }

        $this->map( $methods, $this->pathPrefix . $route, $controller, $name );

        $this->stack[] = end((array_keys($this->routes)));

        return $this;
    }

    public function addMiddleware($when, $middleware)
    {
        //Debugger::debug($this->stack, 'Stack for middleware');
        // Add middleware to all items in the current stack
        foreach ($this->stack as $routeId) {
            $this->routes[$routeId]['middleware'][$when][] = $middleware;
        }

        //Debugger::debug($this->routes);
        return $this;
    }

    public function processRoutes()
    {
        //Debugger::debug($this->routes);
        $match = $this->match();
        if ($match) {
            foreach($this->routes as $route){
                if ($route[2] == $match['target'] && !empty($route['middleware'])) {
                    $match['middleware'] = $route['middleware'];
                }
            }
        }
        return $this->processMatch($match);
    }

    public function processMatch($match)
    {
        // Debugger::debug($this);
        //Debugger::debug($match);

        if ($match === false) {
            // Invalid route - output 404
            return '404/404';
        } else {
            // Process before middleware
            if (!empty($match['middleware']['before'])){
                $this->processMiddleware($match['middleware']['before']);
            }

            list( $controller, $action ) = explode( ':', $match['target'] );

            // check the controler and method are callable
            if ( is_callable(array('Controllers\\' . $controller, $action)) ) {
                // Call the controller method
                $router = clone $this;
                $response = call_user_func_array(array('\Controllers\\' . $controller, $action), array($router, $match['params']));

                //Debugger::debug($response);
                if($response){
                    if(!empty($response['type'])){
                        switch ($response['type']) {
                            case 'redirect':
                                Redirect::go($response['url']);
                                break;
                            case 'api':
                                echo json_encode($response['payload']);
                                break;
                        }
                    } else {
                        return $response;
                    }
                }
            } else {
                if(IS_LIVE){
                    throw(new \Exception('Controller Error: ' . $controller.':' . $action));
                } else {
                    die('Controller Error: ' . $controller.':' . $action);
                }
            }
        }
    }

    public function processMiddleware($middlewareArray)
    {
        foreach($middlewareArray as $middleware){
            // Run the middleware
            $split = explode(':', $middleware);
            call_user_func(array('\App\Middleware\\' . $split[0], $split[1]));
        }
    }

    private function handleResponse($response)
    {
        if($response){
            if(!empty($response['type'])){
                switch ($response['type']) {
                    case 'redirect':
                        Redirect::go($response['url']);
                        break;
                    case 'api':
                        echo json_encode($response['payload']);

                }
            } else {
                $smarty->display($response . '.tpl');
                die();
            }
        }
    }

    public function getRoutes()
    {
        return $this->routes;
    }

    /**
        Reverse route mapping
     **/
    // public function generate($name)
    // {
    //     foreach ($this->routes as $route) {
    //         if ($route['name'] == $name){
    //             return $route['route'];
    //         }
    //     }
    //}




}
