const express = require('express');
const bodyParser = require('body-parser');

const middleware = require('./middleware');
const handler = require('./handler');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', handler.index);

app.post('/login', handler.login);

app.get('/check', middleware.checkToken, handler.check);

app.listen(3000, () => {
    console.log('Listening on port 3000...')    
});
