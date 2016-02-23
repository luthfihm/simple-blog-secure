<?php

/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/21/16
 * Time: 8:20 PM
 */
namespace Controller;
use Exception;
abstract class API
{

    protected $method = '';

    protected $args = Array();

    protected $headers = Array();

    protected $request;

    protected $requestBody;

    public function __construct($args) {

        $this->args = $args;

        if (!function_exists('getallheaders'))
        {
            function getallheaders()
            {
                $headers = '';
                foreach ($_SERVER as $name => $value)
                {
                    if (substr($name, 0, 5) == 'HTTP_')
                    {
                        $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                    }
                }
                return $headers;
            }
        }

        $this->headers = getallheaders();

        $this->method = $_SERVER['REQUEST_METHOD'];
        if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
            if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
                $this->method = 'DELETE';
            } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
                $this->method = 'PUT';
            } else {
                throw new Exception("Unexpected Header");
            }
        }

        $this->requestBody = json_decode(file_get_contents("php://input"));

        switch($this->method) {
            case 'DELETE':
            case 'POST':
                $this->request = $this->_cleanInputs($_POST);
                break;
            case 'GET':
                $this->request = $this->_cleanInputs($_GET);
                break;
            case 'PUT':
                $this->request = $this->_cleanInputs($_GET);
                break;
            default:
                $this->_response('Invalid Method', 405);
                break;
        }
    }

    public function processAPI() {
        try {
            switch($this->method) {
                case 'DELETE':
                    $this->_response($this->delete($this->args));
                    break;
                case 'POST':
                    $this->_response($this->post($this->args));
                    break;
                case 'GET':
                    $this->_response($this->get($this->args));
                    break;
                case 'PUT':
                    $this->_response($this->put($this->args));
                    break;
                default:
                    $this->_response('Invalid Method', 405);
                    break;
            }
        } catch (Exception $e) {
            $this->_response($e->getMessage(), 405);
        }
    }

    abstract public function get($args);

    abstract public function post($args);

    abstract public function delete($args);

    abstract public function put($args);

    protected function _response($data, $status = 200) {
        header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
        echo json_encode($data);
    }

    private function _cleanInputs($data) {
        $clean_input = Array();
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $clean_input[$k] = $this->_cleanInputs($v);
            }
        } else {
            $clean_input = trim(strip_tags($data));
        }
        return $clean_input;
    }

    private function _requestStatus($code) {
        $status = array(
            200 => 'OK',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
        );
        return ($status[$code])?$status[$code]:$status[500];
    }
}