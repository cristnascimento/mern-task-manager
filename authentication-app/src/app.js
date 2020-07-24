const express = require('express');
const bodyParser = require('body-parser');

const routerIndex = require('./router/routerIndex');
const routerAuth = require('./router/routerAuth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/accounts', routerAuth);
app.use('/', routerIndex);

app.listen(3000, () => {
    console.log('Listening on port 3000...')    
});
