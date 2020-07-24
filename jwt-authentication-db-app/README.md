# Express authentication with JWT Tutorial

## Description 

In this tutorial we will show how to generate tokens with JWT and use them to authenticate users. We show how to generate the token after user has provided her credentials and then get the token from the HTTP Request Header to verify the authenticity.

## Dependencies

* Ubuntu 18.04
* Node and NPM
* Express
* JSON Web Token
* SQLite3
* Sequelize

## Install Express

```
$ npm install express
```

## Install JSON Web Token

```
$ npm install jsonwebtoken
```

## Install SQLite3

```
$ npm install sqlite
```

## Install Sequelize

```
$ npm install sequelize
```

## Project structure

For this project we use <thead></thead> following structure
```
src
|--- controller
|--- middleware
|--- model
|--- service
app.js
config.js
package-lock.json
package.json
```
All routes are defined in the `app.js`. As an exercise you can try to use Express Router and create another folder to define your routes.

`controller` folder contains the functions to handle each specific request.

`middleware` folder contains the authenticity verification function that should be included in private routes.

`model` folder contains all the definitions for the `User` class and its access to the database.

`service` folder contains the functions that help the `controller` to handle requests, such as authentication, token generation and verification.

This organization can give some ideas on how to organize your project, therefore, feel free to create your own.

## Create the routes

`app.js`
```javascript
const express = require('express');
const bodyParser = require('body-parser');

const middleware = require('./middleware/middleware');
const controller = require('./controller/controller');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', controller.index);

app.post('/login', controller.login);

app.get('/check', middleware.checkToken, controller.check);

app.listen(3000, () => {
    console.log('Listening on port 3000...')    
});

```

## Create the controller to handle requests

`controller/controller.js`
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const serviceAuth = require('./../service/authentication');
const serviceToken = require('./../service/token');

const login = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    serviceAuth.authenticate(username, password, (err, isAuthenticated) => {
        if (isAuthenticated) {
          serviceToken.generate({username: username}, (err, token) => {
            res.json({
              success: true,
              message: 'Authentication successful!',
              token: token
            });
          });
        } else {
          res.status(403).json({
            success: false,
            message: 'Incorrect username or password'
          });
        }
    });

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

* `/` has public access
* `/login` returns the token if username and password are correct
* `/check` has private access that will be granted to the user if a valid token is provided

The main part here is the token generation after checking the user credentials
```javascript
serviceAuth.authenticate(username, password, (err, isAuthenticated) => {
        if (isAuthenticated) {
          serviceToken.generate({username: username}, (err, token) => {
            res.json({
              success: true,
              message: 'Authentication successful!',
              token: token
            });
          });
        } else {
          res.status(403).json({
            success: false,
            message: 'Incorrect username or password'
          });
        }
    });
```
It uses a service defined on `service` directory. In this way you can change your authentication service without interfering with the general struture of the controller.

## Create middleware

The middleware will the verify the authenticity of the token when accessing specific pages. In our case, it will used in the route `/check`.

`middleware/middleware.js`
```javascript
const jwt = require('jsonwebtoken');
const serviceToken = require('./../service/token');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (typeof token !== 'undefined' && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  if (token) {
    serviceToken.verify(token, (err, decoded) => {
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
app.get('/check', middleware.checkToken, controller.check);
```

## Create the config file for the secret

`config.js`
```javascript
module.exports = {
  secret: 'my secret'
};
```

## Create the model

Configure the connection with the database, `model/connection.js`

```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './storage/janedoe.sqlite',
  logging: false
});

module.exports.sequelize = sequelize;
```

Create the `User` model, `model/user.js`
```javascript
const { Sequelize, Model, DataTypes } = require('sequelize');
const { sequelize } = require('./connection');

class User extends Model {}
User.init({
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: DataTypes.STRING,
  password: DataTypes.STRING
}, { sequelize, modelName: 'User' });

module.exports.User = User;
```

Create the tables in the database `model/createModels.js`
```javascript
const { sequelize } = require('./connection');
const { User } = require('./user');

(async () => {
  await sequelize.sync();
})();
```

run this script to create tables
```
$ node createModels
```

Finally, create a DAO service to be used by other parts of the app, `model/userDao.js`

```javascript
const bcrypt = require('bcrypt');
const { User } = require('./user');

const getUser = async (id, callback) => { 
    const user = await User.findByPk(id);
    callback(null, user);
}

const getUserByUserName = async (username, callback) => { 
    const user = await User.findOne({where: {username: username}});
    callback(null, user);
}

const createUser = (user, callback) => {
  const salt = 10;
  bcrypt.hash(user.password, salt, async (err, hash) => {
    const jane = await User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: hash,
    });
    callback(null);
    console.log(jane.toJSON());
  })
}

const updateUser = async (user) => { }
const deleteUser = async (user) => { }

module.exports = {
    getUser,
    getUserByUserName,
    createUser,
    updateUser,
    deleteUser,
}
```

## Create services

The authentication service, `service/authentication.js`
```javascript
const bcrypt = require('bcrypt');
const serviceDB = require('./../model/userDao');

const authenticate = (username, password, callback) => {

  serviceDB.getUserByUserName(username, (err, user) => {
    
    bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    })
  });

}

module.exports = {
    authenticate
}
```

The token generation and verification service, `service/token.js`
```javascript
let jwt = require('jsonwebtoken');
let config = require('./../config');

const generate = (payload, callback) => {
  jwt.sign(payload, config.secret, (err, token) => {
    callback(null, token);
  });
}

const verify = (token, callback) => {
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, decoded);
        }
    });
}

module.exports = {
    generate,
    verify
}
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
curl -X GET   -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbmVkb2UiLCJpYXQiOjE1OTU2MDAwMzN9._d2JpQcFiO_kkMTUFmYB3EVrKW2BzPv68Fk3ja-S0Z4'   http://localhost:3000/check
```

## Access home page

This page does not require authentication
```
$ curl -X GET http://localhost:3000/
```

## Conclusion

In this tutorial you have learned how use jwt to authenticate users with Node and Express. This tutorial was extracted from [A Guide to JWT Authentication](https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4) and you can check the full article for more details.

For the next step I'd like to suggest you trying to connect this app with a database and use a encrypted password for checking. That would be a nice challenge.
