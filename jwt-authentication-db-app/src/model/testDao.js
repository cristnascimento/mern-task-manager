const serviceDao = require('./userDao')

let user = {
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'janedoe',
    email: 'janedoe@gmail.com',
    password: 'janedoe',
};

/*serviceDao.createUser(user, (err) => {
    console.log("returned!");
});*/

let id = 1;

serviceDao.getUser(id, (err, user) => {
    if (user == null) {
        console.log("Not found!");
    } else {
        console.log(user.toJSON());
    }
});

serviceDao.getUserByUserName('janedoe', (err, user) => {
    if (user == null) {
        console.log("Not found!");
    } else {
        console.log(user.toJSON());
    }
});
