const serviceDB = require('./../model/userDao')

const authenticate = (username, password, callback) => {

  serviceDB.getUserByUserName(username, (err, user) => {
    if (user && password === user.password) { 
            callback(null, true);
    } else {
        callback(null, false);
    }
  });

}

module.exports = {
    authenticate
}
