# Contact list with Node, Express, Handlebars and Bootstrap

## Description

This project shows some essential features of the [Express framework](http://expressjs.com) using a contact list as a use case.

## Dependencies

* Ubuntu 18.04
* Node/NPM
* Express
* [Handlebars](handlebarsjs.com)
* body-parser
* Bootstrap

## Install Node/NPM

* Download Node from [Node Official Website](https://nodejs.org/)
* Follow the [documentation](https://github.com/nodejs/help/wiki/Installation) for installation

## Init npm

```
$ npm init
```
## Install Express

```
$ npm install --save express
```

## Install Handlebars

```
$ npm install --save express-handlebars
```

See this [Handlebars Quick Reference](https://github.com/ericf/express-handlebars)

## Install body-bodyParser

```
$ npm install --save body-parser
```

Learn more about [body-parser](https://github.com/expressjs/body-parser)

## Create Handlebars structure

```
├── app.js
└── views
    ├── home.handlebars
    └── layouts
        └── main.handlebars

2 directories, 3 files
```

## Create the server using handlebars

Create and edit app.js

```js
var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(3000);
```

view/layout/main.handlebars

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Example App</title>
</head>
<body>

    {{{body}}}

</body>
</html>
```

view/home.handlebars

```html
<h1>Example App: Home</h1>
```

Pass parameters

```js
res.render("contact", { mode: "view", contact: contact });
```
## Add routes

```js
app.get("/contact/edit/:id", function (req,res) {
  var contact = contacts.find(element => element.id == req.params.id);
  res.render("contact", { mode: "edit", contact: contact });
});
```

## Edit your handlebars using {{ }}

views/contact.handlebars

```html
<div class="form-group col-md-6">
  <label for="inputFirstName">First Name</label>
  <input type="text" class="form-control" id="inputFirstName" name="firstName" value="{{contact.firstName}}" {{ifReadonly mode}}>
</div>
```

## Include ternary operator

```js
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
            ifSelected: function (a,b) { return a == b ? "selected" : ""; },
            ifChecked: function (a) { return a == "on" ? "checked" : ""; },
            ifReadonly: function (a) { return a == "view" ? "readonly" : "" },
            ifDisabled: function (a) { return a == "view" ? "disabled" : "" }
    }
});
...
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
...
```

Use it in handlebars file views/contact.handlebars

```html
<select id="inputPhoneCategory" class="form-control" name="phoneCategory" value="{{contact.phoneCategory}}" {{ifDisabled mode}}>
  <option {{ifSelected contact.phoneCategory "Mobile"}}>Mobile</option>
  <option {{ifSelected contact.phoneCategory "Home"}}>Home</option>
  <option {{ifSelected contact.phoneCategory "Work"}}>Work</option>
</select>
```

## Create mock data

```js
let contacts = [
  {
    id:1,
    firstName: "William",
    lastName: "Patterson",
    email: "patterson@blindspot.com",
    phone: "+1 101 890809890",
    phoneCategory: "Mobile",
    address: "44 11th south",
    city: "New York",
    state: "PR",
    zip: "87987",
    closeFriend: ""},
...
]
```

## Add body-parser

```js
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

...
app.get("/contact/view/:id", function (req,res) {
  var contact = contacts.find(element => element.id == req.params.id);
...
app.post("/contact/post", function (req,res) {
    let contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
...

```
