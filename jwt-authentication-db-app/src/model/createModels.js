const { sequelize } = require('./connection');
const { User } = require('./user');

(async () => {
  await sequelize.sync();
})();
