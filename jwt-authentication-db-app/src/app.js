const express = require('express');
const bodyParser = require('body-parser');

const middleware = require('./middleware/middleware');
const controller = require('./controller/controller');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.get('/', controller.index);

app.post('/login', controller.login);

app.get('/check', middleware.checkToken, controller.check);

app.listen(3000, () => {
    console.log('Listening on port 3000...')    
});
