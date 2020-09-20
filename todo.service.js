let items = require("./todo.mock-data");
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

const createItem = function (id, body) {
  return {
    id: id,
    description: body.description,
  };
}

const getItems = function() {
  return items;
}

const add = function (body) {
  let item = createItem(nextId, body);
  nextId += 1;
  items.push(item);
  return item.id;
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
  getItems: getItems,
  add: add,
  find: find,
  update: update,
  delete: remove,
  print: print,
};
