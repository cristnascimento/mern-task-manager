let jwt = require('jsonwebtoken');
let config = require('./../config');

const generate = (payload, callback) => {
  console.log(payload);
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
