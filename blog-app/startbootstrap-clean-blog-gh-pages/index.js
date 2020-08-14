const express = require('express')
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost')

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.listen(4000, () => {
    console.log('Listening on port 4000')
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/post', (req, res) => {
    res.render('post')
})

app.get('/posts/new', (req, res) => {
    res.render('create')
})

app.post('/posts/store', async (req, res) => {
    await BlogPost.create(req.body)
    res.redirect('/')
})



