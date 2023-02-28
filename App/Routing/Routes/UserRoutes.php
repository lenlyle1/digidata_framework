<?php

namespace Controllers;

use \Routing\Router;

/** ========================================================
 *  Authed routers
 * =======================================================*/
$router->add('GET', '/todo/[*:todoId]?', 'TodoController:listTodos', 'user-todos');