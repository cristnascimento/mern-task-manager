# Express authentication with JWT Tutorial

## Description 

In this tutorial we will show how to generate tokens with JWT and use them to authenticate users. We show how to generate the token after user has provided her credentials and then get the token from the HTTP Request Header to verify the authenticity.

## Dependencies

* Ubuntu 18.04
* Node and NPM
* Express
* JSON Web Token

## Install Express

```
$ npm install express
```

## Install JSON Web Token

```
$ npm install jsonwebtoken
```

## Create the routes

`app.js`
```javascript
const express = require('express');
const bodyParser = require('body-parser');

const middleware = require('./middleware');
const handler = require('./handler');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', handler.index);

app.post('/login', handler.login);

app.get('/check', middleware.checkToken, handler.check);

app.listen(3000, () => {
    console.log('Listening on port 3000...')    
});
```

## Create the handlers for each route

`handler.js`
```javascript
const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config');

const login = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  // For the given username fetch user from DB
  let mockedUsername = 'admin';
  let mockedPassword = 'password';

  if (username && password) {
    if (username === mockedUsername && password === mockedPassword) {
      jwt.sign({username: username}, config.secret, (err, token) => {
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      });
      // return the JWT token for the future API calls
    } else {
      res.status(403).json({
        success: false,
        message: 'Incorrect username or password'
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Authentication failed! Please check the request'
    });
  }
}

const index = (req, res) => {
    res.send("Hello Home!");
};

const check = (req, res) => {
    res.send("Hello Private! Foo: " + req.decoded.username);
};

module.exports = {
  login: login,
  index: index,
  check: check
};
```

We have defined three routes:

* `/`: public accessible to any user
* `/login`: returns the token if username and password are correct
* `/check`: private access that will be granted if a valid token is provided

The main part here is the token generation after checking the user credentials
```javascript
jwt.sign({username: username}, config.secret, (err, token) => {
    res.json({
      success: true,
      message: 'Authentication successful!',
      token: token
    });
});
```
It users the secret 'my secret' in the config file and it puts the **username** in the payload. Then, it returns the token in the response to the request.

## Create middleware

The middleware will the verify the authenticity of the token when accessing specific pages. In our case, it will used in the route `/check`.

`middleware.js`
```javascript
let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (typeof token !== 'undefined' && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken
}
```
Notice that the token is extracted from the Header of the request. It means the agent requesting this page should include the token when it requests the page.

We had set up this middleware previously on `app.js`

```javascript
app.get('/check', middleware.checkToken, handler.check);
```

## Create the config file for the secret

`config.js`
```javascript
module.exports = {
  secret: 'my secret'
};
```

## Run the app

```
$ node app
```

## Access login page and get a token

```
$ curl --header "Content-Type: application/json"   --request POST   --data '{"password":"password", "username":"admin"}'   http://localhost:3000/login
```

Then use the token in the following requests to have access to private content

## Access page without headers

```
$ curl -X GET http://localhost:3000/check
```

## Access page with invalid token

```
curl -X GET   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNTM0OTI1MTQwLCJleHAiOjE1MzUwMTE1NDB9.MIcWFBzAr5WVhbaSa1kd1_hmEZsepo8fXqotqvAerKI'   http://localhost:3000/check
```

## Access page with a valid token

```
curl -X GET   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1OTU0MjM5NjV9.YoofwHiPmMbpwewC9Wzp2gcW0W8gP1PzYBfaRjhjwH4'   http://localhost:3000/check
```

## Access home page

This page does not require authentication
```
$ curl -X GET http://localhost:3000/
```

## Conclusion

In this tutorial you have learned how use jwt to authenticate users with Node and Express. This tutorial was extracted from [A Guide to JWT Authentication](https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4) and you can check the full article for more details.

For the next step I'd like to suggest you trying to connect this app with a database and use a encrypted password for checking. That would be a nice challenge.
