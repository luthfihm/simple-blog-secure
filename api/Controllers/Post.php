<?php
/**
 * Created by IntelliJ IDEA.
 * User: luthfi
 * Date: 2/22/16
 * Time: 9:59 PM
 */

namespace Controller;
use Exception;
use Model\Comment;
use Model\User;


class Post extends API
{
    private $postModel;
    private $commentModel;
    private $userModel;

    public function __construct($args)
    {
        parent::__construct($args);
        $this->postModel = new \Model\Post();
        $this->commentModel = new Comment();
        $this->userModel = new User();
    }

    public function get($args)
    {
        if (sizeof($args) == 0) {
            return $this->postModel->getAll();
        } else if (sizeof($args) == 1) {
            if ($args[0] > 0) {
                return $this->postModel->getById($args[0]);
            } else {
                throw new Exception("Invalid!");
            }
        } else if (sizeof($args) == 2) {
            if ($args[0] > 0) {
                if ($args[1] == "comments") {
                    return $this->commentModel->getByPost($args[0]);
                } else {
                    throw new Exception("Invalid!");
                }
            } else {
                throw new Exception("Invalid!");
            }
        } else {
            throw new Exception("Invalid!");
        }
    }

    public function post($args)
    {
        if (sizeof($args) == 0) {
            $filename = uniqid().basename($_FILES['image']['name']);
            $uploadFile = DIR_UPLOAD . $filename;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                $post = [
                    "title" => $this->request["title"],
                    "image" => $filename,
                    "content" => $this->request["content"],
                    "user_id" => $this->request["user_id"],
                    "created_at" => date("Y-m-d H:i:s")
                ];
                return $this->postModel->addPost($post);
            } else {
                throw new Exception("Failed");
            }
        } else if (sizeof($args) == 1) {
            if ($args[0] > 0) {
                $user = $this->userModel->current();
                if ($this->request['user_id'] == $user['id']) {
                    $post = [
                        "title" => $this->request["title"],
                        "content" => $this->request["content"],
                        "user_id" => $this->request["user_id"],
                        "created_at" => date("Y-m-d H:i:s")
                    ];
                    if (isset($_FILES['image'])) {
                        $filename = uniqid().basename($_FILES['image']['name']);
                        $uploadFile = DIR_UPLOAD . $filename;

                        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
                            $post['image'] = $filename;
                        }
                    }
                    return $this->postModel->updatePost($args[0],$post);
                } else {
                    throw new Exception("Unauthorized!");
                }
            } else {
                throw new Exception("Invalid!");
            }
        } else if (sizeof($args) == 2) {
            if ($args[0] > 0) {
                if ($args[1] == "comments") {
                    $comment = [
                        "text" => $this->requestBody->text,
                        "user_id" => $this->requestBody->userId,
                        "post_id" => $this->requestBody->postId,
                        "time" => date("Y-m-d H:i:s")
                    ];
                    return $this->commentModel->addComment($comment);
                } else {
                    throw new Exception("Invalid!");
                }
            } else {
                throw new Exception("Invalid!");
            }
        } else {
            throw new Exception("Invalid!");
        }
    }

    public function delete($args)
    {
        if (sizeof($args) == 1) {
            if ($args[0] > 0) {
                $user = $this->userModel->current();
                if ($user) {
                    return $this->postModel->deleteOne($args[0]);
                } else {
                    throw new Exception("Unauthorized!");
                }
            } else {
                throw new Exception("Invalid!");
            }
        } else {
            throw new Exception("Invalid!");
        }
    }

    public function put($args)
    {
        // TODO: Implement put() method.
    }
}