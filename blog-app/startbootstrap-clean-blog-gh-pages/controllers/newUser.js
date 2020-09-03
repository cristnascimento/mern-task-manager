const flash = require('connect-flash');

module.exports = (req, res) => {
    let username = '';
    let password = '';
    // after this flash is undefined
    let data = req.flash('data')[0];

    if (typeof data != "undefined") {
        username = data.username;
        password = data.password;
        console.log("not undefined");
    }

    res.render('register', {
        errors: req.flash('validationErrors'),
        username: username,
        password: password
    });
}