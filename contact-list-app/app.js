const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const bodyParser = require('body-parser');

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
  {
    id: 2,
    firstName: "Edgar",
    lastName: "Reade",
    email: "reade@blindspot.com",
    phone: "+1 301 730809890",
    phoneCategory: "Mobile",
    address: "1201 Atlantic Avenue",
    city: "New York",
    state: "RJ",
    zip: "453452",
    closeFriend: "on"},
  {
    id: 3,
    firstName: "Natasha",
    lastName: "Zapata",
    email: "zapata@blindspot.com",
    phone: "+1 728 79909141",
    phoneCategory: "Mobile",
    address: "322 Frank St",
    city: "New York",
    state: "MG",
    zip: "4532234",
    closeFriend: ""
  },
];

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
            ifSelected: function (a,b) { return a == b ? "selected" : ""; },
            ifChecked: function (a) { return a == "on" ? "checked" : ""; },
            ifReadonly: function (a) { return a == "view" ? "readonly" : "" },
            ifDisabled: function (a) { return a == "view" ? "disabled" : "" }
    }
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get("/", function (req,res) {
    res.render("home");
});

app.get("/home", function (req,res) {
    res.render("home");
});

app.get("/contact/list", function (req,res) {
    res.render("list", {contacts: contacts});
});

app.get("/contact/add", function (req,res) {
    res.render("contact", { mode: "add" });
});

app.get("/contact/edit/:id", function (req,res) {
  var contact = contacts.find(element => element.id == req.params.id);
  res.render("contact", { mode: "edit", contact: contact });
});

app.get("/contact/view/:id", function (req,res) {
  var contact = contacts.find(element => element.id == req.params.id);
  res.render("contact", { mode: "view", contact: contact });
});

app.post("/contact/post", function (req,res) {
    let contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      phoneCategory: req.body.phoneCategory,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      closeFriend: req.body.closeFriend ? "on" : "",
    };
    contacts.push(contact);
    console.log("firstName: "+contact.firstName);
    console.log("lastName: "+contact.lastName);
    console.log("email: "+contact.email);
    console.log("phone: "+contact.phone);
    console.log("phoneCategory: "+contact.phoneCategory);
    console.log("address: "+contact.address);
    console.log("city: "+contact.city);
    console.log("state: "+contact.state);
    console.log("zip: "+contact.zip);
    console.log("closeFriend: "+contact.closeFriend);
    res.end("lastName"+contact.lastName);
});

app.listen(3000, function() {
    console.log("Running on http://localhost:3000");
});
