const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const bodyParser = require('body-parser');
const service = require("./contact.service");

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
    let contacts = service.getContacts();
    res.render("list", {contacts: contacts});
});

app.get("/contact/add", function (req,res) {
    let mode = {add: true, edit: false, view: false};
    res.render("contact", { title: "Add contact", mode: mode, readonly: "", disabled: ""});
});

app.get("/contact/edit/:id", function (req,res) {
  let mode = {add: false, edit: true, view: false};
  let contact = service.find(req.params.id);
  res.render("contact", { title: "Update contact", mode: mode, contact: contact, readonly: "", disabled: "" });
});

app.get("/contact/view/:id", function (req,res) {
  let mode = {add: false, edit: false, view: true};
  let contact = service.find(req.params.id);
  res.render("contact", { title: "View contact", mode: mode, contact: contact, readonly: "readonly", disabled: "disabled" });
});

app.post("/contact/post", function (req,res) {
    let newId = service.add(req.body);
    service.print(newId);
    res.redirect("/contact/list");
});

app.post("/contact/update/:id", function (req, res) {
  service.update(req.params.id, req.body);
  service.print(req.params.id);
  res.redirect("/contact/view/"+req.params.id);
});

app.get("/contact/delete/:id", function (req, res) {
  service.delete(req.params.id);
  res.redirect("/contact/list");
});

app.listen(3000, function() {
    console.log("Running on http://localhost:3000");
});
