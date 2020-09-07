const express = require('express')

const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash');

const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const getPostController = require('./controllers/getPost');
const storePostController = require('./controllers/storePost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');
const logoutController = require('./controllers/logout');

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express()

const validateMiddleware = (req, res, next) => {
    if (req.files == null || req.body.title == null || req.body.body == null) {
        return res.redirect('/posts/new')
    }
    next();
};

global.loggedIn = null;

app.use(flash());
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.use('/posts/store', validateMiddleware);
app.use(expressSession({secret: 'keyboard cat'}));
app.use('*', (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

let port = process.env.PORT;

if (port == null || port == "") {
    port = 4000;
}

app.listen(port, () => {
    console.log('Listening on port 4000')
})

app.get('/', homeController);

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/post/:id', getPostController);

app.get('/posts/new', authMiddleware, newPostController);

app.post('/posts/store', authMiddleware, storePostController);

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);

app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);

app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

app.get('/auth/logout', logoutController);

app.use((req, res) => {
    res.render('notfound');
})