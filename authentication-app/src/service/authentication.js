const bcrypt = require('bcrypt');
const serviceDB = require('./../model/userDao');

const authenticate = (username, password, callback) => {

  serviceDB.getUserByUserName(username, (err, user) => {
    
    bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
            callback(null, true, user.id);
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
