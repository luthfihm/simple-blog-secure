<?php
/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/23/16
 * Time: 12:09 AM
 */

namespace Model;
use Exception;
use DateTime;


class Comment extends Model
{
    private $table = "comments";
    private $userModel;

    public function __construct()
    {
        parent::__construct();
        $this->userModel = new User();
    }

    public function addComment($comment) {
        $id = $this->database->insert($this->table,$comment);
        if ($id) {
            return $this->getById($id);
        } else {
            throw new Exception("failed");
        }
    }

    public function getById($id) {
        $comment = $this->database->get($this->table,"*",["id"=>$id]);
        $dateTime = new DateTime($comment["time"]);
        $comment["time"] = $dateTime->getTimestamp()*1000;
        $comment['user'] = $this->userModel->getById($comment['user_id']);
        unset($comment['user_id']);
        return $comment;
    }

    public function getByPost($post_id) {
        $comments = [];
        foreach ($this->database->select($this->table, "*", ["post_id" => $post_id, "ORDER" => "id DESC"]) as $comment) {
            $dateTime = new DateTime($comment["time"]);
            $comment["time"] = $dateTime->getTimestamp()*1000;
            $comment['user'] = $this->userModel->getById($comment['user_id']);
            unset($comment['user_id']);
            $comments[] = $comment;
        }
        return $comments;
    }
}