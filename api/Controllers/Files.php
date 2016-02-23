<?php
/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/23/16
 * Time: 9:26 PM
 */

namespace Controller;
use Exception;

class Files extends API
{
    public function __construct($args)
    {
        parent::__construct($args);
    }

    public function get($args)
    {
        if (sizeof($args) == 1) {
            $name = DIR_UPLOAD.$args[0];
            $fp = fopen($name, 'rb');

            header("Content-Type: ". mime_content_type($name));
            header("Content-Length: " . filesize($name));

            fpassthru($fp);
            exit();
        } else {
            throw new Exception("Invalid!");
        }
    }

    public function post($args)
    {
        // TODO: Implement post() method.
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