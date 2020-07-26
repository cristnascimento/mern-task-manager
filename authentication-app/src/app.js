const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const cookieParser = require('cookie-parser')

const indexRouter = require('./router/indexRouter');
const accountsRouter = require('./router/accountsRouter');
const authMiddleware = require('./middleware/authenticationMiddleware');

const app = express();

app.use(express.static('public'))

app.use(cookieParser());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(authMiddleware.validateToken);

app.use('/accounts', accountsRouter);
app.use('/', indexRouter);

app.listen(3000, () => {
    console.log('Listening on port 3000...')    
});
