const express = require('express')

const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const getPostController = require('./controllers/getPost');
const storePostController = require('./controllers/storePost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express()

const validateMiddleware = (req, res, next) => {
    if (req.files == null || req.body.title == null || req.body.body == null) {
        return res.redirect('/posts/new')
    }
    next();
};

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.use('/posts/store', validateMiddleware);

app.listen(4000, () => {
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

app.get('/posts/new', newPostController);

app.post('/posts/store', storePostController);

app.get('/auth/register', newUserController);

app.post('/users/register', storeUserController);

