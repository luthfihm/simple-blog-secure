# Simple Blog

Features:

 * Register and Login
 * Remember Login
 * Create Post
 * List Post
 * Read Post
 * Edit Post
 * Delete Post
 * Add Comment to Post

Frontend:

 * Static web html with AngularJs Based
 * Grunt task runner for development and testing

Backend:

 * PHP

Build script:

 * Gradle

Deployment

 * Docker Compose

## Prerequisites

Before run this project, you must install:

 * Java Runtime (jre)
 * Docker
 * Docker Compose

## Build Project

Run this script on your console

```
./gradlew build
```

## Deployment

Make sure that you have turn on docker service. Run this script on your console.
```
docker-compose up -d
```
Open PhpMyAdmin on
```
http://localhost:8181 (linux)
http://<boot2docker-ip>:8181 (Mac or Windows) (default : 192.168.99.100)
```
Then, create database with name ```simple_blog``` and import ```simple_blog.sql```to this database

## Running the Simple Blog
```
http://localhost:8081 (linux)
http://<boot2docker-ip>:8081 (Mac or Windows) (default : 192.168.99.100)
```
