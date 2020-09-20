var express = require('express');
var router = express.Router();
const service = require("./contact.service");
const todoService = require("./todo.service");

router.get("/", function (req,res) {
    res.render("home");
});

router.get("/home", function (req,res) {
    res.render("home");
});

router.get("/contact/list", function (req,res) {
    let contacts = service.getContacts();
    res.render("list", {contacts: contacts});
});

router.get("/contact/add", function (req,res) {
    let mode = {add: true, edit: false, view: false};
    res.render("contact", { title: "Add contact", mode: mode, readonly: "", disabled: ""});
});

router.get("/contact/edit/:id", function (req,res) {
  let mode = {add: false, edit: true, view: false};
  let contact = service.find(req.params.id);
  res.render("contact", { title: "Update contact", mode: mode, contact: contact, readonly: "", disabled: "" });
});

router.get("/contact/view/:id", function (req,res) {
  let mode = {add: false, edit: false, view: true};
  let contact = service.find(req.params.id);
  res.render("contact", { title: "View contact", mode: mode, contact: contact, readonly: "readonly", disabled: "disabled" });
});

router.post("/contact/post", function (req,res) {
    let newId = service.add(req.body);
    service.print(newId);
    res.redirect("/contact/list");
});

router.post("/contact/update/:id", function (req, res) {
  service.update(req.params.id, req.body);
  service.print(req.params.id);
  res.redirect("/contact/view/"+req.params.id);
});

router.get("/contact/delete/:id", function (req, res) {
  service.delete(req.params.id);
  res.redirect("/contact/list");
});

router.post("/list/todo", function (req,res) {
  let newId = todoService.add(req.body);
  res.redirect("/list/todo/1");
});

router.get("/list/todo/:id", function (req, res) {
  let items = todoService.getItems();
  res.render("todo-list", {data: items});
});

module.exports = router;
