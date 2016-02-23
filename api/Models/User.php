<?php

/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/21/16
 * Time: 10:46 PM
 */
namespace Model;
use Exception;
class User extends Model
{

    private $table = "users";

    public function __construct()
    {
        parent::__construct();
    }

    public function addUser($user) {
        $data = [
            "username" => $user->username,
            "password" => md5($user->password),
            "name" => $user->name
        ];
        $id = $this->database->insert($this->table,$data);
        if ($id) {
            return $this->getById($id);
        } else {
            throw new Exception("failed");
        }
    }

    public function getById($id) {
        return $this->database->get($this->table,["id","username","name"],[
            "id" => $id
        ]);
    }

    public function login($username, $password, $remember) {
        $user = $this->database->get($this->table,["id","username","name"],[
            "AND" => [
                "username" => $username,
                "password" => md5($password)
            ]
        ]);
        if ($user) {
            $_SESSION['id'] = $user['id'];
            if ($remember) {
                setcookie("id", $user['id'], time() + (86400 * 30), "/"); // 86400 = 1 day
            }
            return $user;
        } else {
            throw new Exception("Invalid Login");
        }
    }

    public function current() {
        $id = null;
        if (isset($_SESSION['id'])) {
            $id = $_SESSION['id'];
        } else if (isset($_COOKIE['id'])) {
            $id = $_COOKIE['id'];
            $_SESSION['id'] = $id;
        } else {
            throw new Exception("error");
        }
        $user = $this->database->get($this->table,["id","username","name"],[
            "id" => $id
        ]);
        if ($user) {
            return $user;
        } else {
            throw new Exception("error");
        }
    }

    public function logout() {
        if (isset($_SESSION['id'])) {
            unset($_SESSION['id']);
            unset($_COOKIE['id']);
            setcookie('id', null, -1, '/');
            session_destroy();
            return "Logged out";
        } else {
            throw new Exception("error");
        }
    }
}