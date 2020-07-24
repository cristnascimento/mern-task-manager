const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser')

const routerIndex = require('./router/routerIndex');
const accountsRouter = require('./router/accountsRouter');

const app = express();

app.use(express.static('public'))

app.use(cookieParser());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/accounts', accountsRouter);
app.use('/', routerIndex);

app.listen(3000, () => {
    console.log('Listening on port 3000...')    
});
