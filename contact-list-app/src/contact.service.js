let contacts = require("./contact.mock-data");
let nextId = 4;

const print = function(id) {
  console.log("find id:"+id);
  let contact = contacts.find(element => element.id == id);
  console.log("id: "+contact.id);
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
}

const createContact = function (id, body) {
  return {
    id: id,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    phoneCategory: body.phoneCategory,
    address: body.address,
    city: body.city,
    state: body.state,
    zip: body.zip,
    closeFriend: body.closeFriend ? "on" : "",
  };
}

const getContacts = function() {
  return contacts;
}

const add = function (body) {
  let contact = createContact(nextId, body);
  nextId += 1;
  contacts.push(contact);
  return contact.id;
}

const find = function(id) {
  return contacts.find(element => element.id == id);
}

const update = function(id, body) {
  let contact = createContact(id, body);
  let contactToUpdate = contacts.find(element => element.id == id);
  let index = contacts.indexOf(contactToUpdate);
  contacts[index] = contact;
}

const remove = function (id) {
  let newContacts = contacts.filter(element => element.id != id);
  contacts = newContacts;
}

module.exports = {
  getContacts: getContacts,
  add: add,
  find: find,
  update: update,
  delete: remove,
  print: print,
};
