<?php
/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/21/16
 * Time: 11:32 PM
 */

namespace Controller;
use Exception;


class User extends API
{

    private $user;

    public function __construct($args)
    {
        parent::__construct($args);
        $this->user = new \Model\User();
    }

    public function get($args)
    {
        if (sizeof($args) == 1) {
            if ($args[0] == "current") {
                return $this->user->current();
            } else if ($args[0] == "logout") {
                return $this->user->logout();
            } else {
                throw new Exception("Invalid!");
            }
        } else {
            throw new Exception("Invalid!");
        }
    }

    public function post($args)
    {
        if (sizeof($args) == 1) {
            if ($args[0] == "login") {
                $username = $this->requestBody->username;
                $password = $this->requestBody->password;
                $remember = $this->requestBody->remember;
                return $this->user->login($username, $password, $remember);
            } else if ($args[0] == "signup") {
                return $this->user->addUser($this->requestBody);
            } else {
                throw new Exception("Invalid!");
            }
        } else {
            throw new Exception("Invalid!");
        }
    }

    public function delete($args)
    {
        // TODO: Implement delete() method.
        throw new Exception("Invalid!");
    }

    public function put($args)
    {
        // TODO: Implement put() method.
        throw new Exception("Invalid!");
    }
}