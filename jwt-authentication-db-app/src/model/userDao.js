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
