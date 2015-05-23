# auth-examples

Example code for talk at oslo.nodeconf.com

Working server exists in the `src`-folder. Run `npm install` first.

Slides in the `slides`-folder.

# Setup

    npm install
    cd src
    node server.js

# Run

Create user

    curl -X POST -d "username=foo&password=bar" localhost:8081/setup   => 200 "User foo created"

Login

    curl -X POST -d "username=foo&password=bar" localhost:8081/login   => 200 "BEARER eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmb28iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNDMyNDA2MzEwLCJleHAiOjE0MzI0MDYzNzB9.6YkKW5XGbGLe8S3E62LSWlr9IeT38c43k8338MsoIpw"

Access restricted endpoint

    curl --header "Authorization:Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmb28iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNDMyNDA2MzEwLCJleHAiOjE0MzI0MDYzNzB9.6YkKW5XGbGLe8S3E62LSWlr9IeT38c43k8338MsoIpw" "localhost:8081/restricted"   => 200 "Congrats, foo"
 
## Other responses
 
    curl localhost:8081/restricted   => 401 Unauthorized
    if you wait 1 minute you'll get: 500 {"message":"jwt expired"}
    if you pass the wrong token you'll get: 500 {"message":"invalid signature"}
