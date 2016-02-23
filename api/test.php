<?php
/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/22/16
 * Time: 10:39 AM
 */

require_once "config.php";
echo DIR_UPLOAD;

if (is_writable(DIR_UPLOAD)) {
    echo "oke";
} else {
    echo "not oke";
}