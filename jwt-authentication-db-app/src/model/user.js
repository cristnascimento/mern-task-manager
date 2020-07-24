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
