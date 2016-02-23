<?php
/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/21/16
 * Time: 8:07 PM
 */

session_start();

require_once "config.php";
require_once "Libraries/medoo.php";
require_once "Systems/API.class.php";
require_once "Systems/API.Interface.php";
require_once "Systems/Model.class.php";

$controllerDir = "Controllers";
$modelDir = "Models";

try {
    $controllers = scandir($controllerDir);
    foreach ($controllers as $controller) {
        if (substr($controller,-4) == ".php") {
            require_once $controllerDir . "/" . $controller;
        }
    }

    $models = scandir($modelDir);
    foreach ($models as $model) {
        if (substr($model,-4) == ".php") {
            require_once $modelDir . "/" . $model;
        }
    }

    $request = $_SERVER['REQUEST_URI'];

    $args = explode('/', rtrim($request, '/'));
    while ($args[0] == '') {
        array_shift($args);
    }
    $endpoint = "Controller\\".array_shift($args);
    $api = new $endpoint($args);
    $api->processAPI();
//    echo $request;
} catch (Exception $e) {
    echo json_encode(Array('error' => $e->getMessage()));
}