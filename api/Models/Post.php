<?php
/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/22/16
 * Time: 9:43 PM
 */

namespace Model;
use Exception;
use DateTime;


class Post extends Model
{
    private $table = "posts";
    private $userModel;
    private $commentModel;

    public function __construct()
    {
        parent::__construct();
        $this->userModel = new User();
        $this->commentModel = new Comment();
    }

    public function addPost($post) {
        $id = $this->database->insert($this->table,$post);
        if ($id) {
            return $this->getById($id);
        } else {
            throw new Exception("failed");
        }
    }

    public function getById($id) {
        $post = $this->database->get($this->table,"*",["id" => $id]);
        $dateTime = new DateTime($post["created_at"]);
        $post["created_at"] = $dateTime->getTimestamp()*1000;
        $post["user"] = $this->userModel->getById($post["user_id"]);
        $post["comments"] = $this->commentModel->getByPost($post["id"]);
        unset($post["user_id"]);
        return $post;
    }

    public function getAll() {
        $posts = [];
        foreach ($this->database->select($this->table, "*", ["ORDER" => "created_at DESC"]) as $post) {
            $dateTime = new DateTime($post["created_at"]);
            $post["created_at"] = $dateTime->getTimestamp()*1000;
            $post["user"] = $this->userModel->getById($post["user_id"]);
            $post["comments"] = $this->commentModel->getByPost($post["id"]);
            unset($post["user_id"]);
            $posts[] = $post;
        }
        return $posts;
    }

    public function updatePost($id, $post) {
        if ($this->database->update($this->table,$post,["id"=>$id])) {
            return $this->getById($id);
        } else {
            throw new Exception("Failed");
        }
    }

    public function deleteOne($id) {
        return $this->database->delete($this->table,["id"=>$id]);
    }
}