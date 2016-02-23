<?php

/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/21/16
 * Time: 9:49 PM
 */
interface ApiInterface
{
    public function get($args);

    public function post($args);

    public function delete($args);

    public function put($args);
}