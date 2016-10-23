# Node.js and MongoDB test application

### Requirements
1. Docker and Docker-compose
    1.1 For docker installation use official guide https://docker.github.io/engine/installation/
    1.2 For docker-compose installation use official guide https://docs.docker.com/compose/install/

2. Overriding templates
    2.1 Copy file _.env.mongodb.example_ and rename it to _.env.mongodb_. After that change values in _.env.mongodb_ to yours.
    2.2 Copy _docker-compose.local.yml_ and rename it to _docker-compose.override.yml_. It's need to use ports for docker containers.

### Startup application
For startup the application use command:
```
$ docker-compose up
```
For stop the application use command:
```
$docker-compose down
```