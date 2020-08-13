const mongoose = require('mongoose');

const BlogPost = require('./models/BlogPost');

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true});

BlogPost.find({}, (error, blogpost) => {
    console.log(error, blogpost)
})

let id = '5f3490e4321a88597cf3c788';
BlogPost.findById(id, (error, blogpost) => {
    console.log(error, blogpost)
})

BlogPost.findByIdAndUpdate(id, {title: 'Updated title'}, (error, blogpost) => {
    console.log(error, blogpost)
})