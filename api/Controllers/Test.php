<?php

/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/21/16
 * Time: 8:38 PM
 */
namespace Controller;
use Exception;
class Test extends API
{
    public function __construct($args)
    {
        parent::__construct($args);
//        if(isset($this->headers['X-Auth-Token'])){
//            $token = $this->headers['X-Auth-Token'];
//            $user = new \Model\User();
//            if (!$user->validateToken($token)) {
//                $this->_response('Unauthorized', 405);
//                exit();
//            }
//        } else {
//            $this->_response('Unauthorized', 405);
//            exit();
//        }
    }

    public function get($args)
    {
        return session_id();
    }

    public function post($args)
    {
        session_start();
        return session_id();
    }

    public function delete($args)
    {
        // TODO: Implement delete() method.
    }

    public function put($args)
    {
        // TODO: Implement put() method.
    }
}