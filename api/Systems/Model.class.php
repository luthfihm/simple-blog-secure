<?php

/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/21/16
 * Time: 10:47 PM
 */
namespace Model;
use PDO;
use medoo;
abstract class Model
{
    protected $database = null;

    public function __construct()
    {
        try {
            $this->database = new medoo([
                // required
                'database_type' => 'mysql',
                'database_name' => DB_NAME,
                'server' => DB_HOST,
                'username' => DB_USER,
                'password' => DB_PASS,
                'charset' => 'utf8',
                // [optional]
                'port' => 3306,

                // driver_option for connection, read more from http://www.php.net/manual/en/pdo.setattribute.php
                'option' => [
                    PDO::ATTR_CASE => PDO::CASE_NATURAL
                ]
            ]);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}