const exphbs = require("express-handlebars");

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
            ifSelected: function (a,b) { return a == b ? "selected" : ""; },
            ifChecked: function (a) { return a == "on" ? "checked" : ""; },
            ifReadonly: function (a) { return a == "view" ? "readonly" : "" },
            ifDisabled: function (a) { return a == "view" ? "disabled" : "" }
    }
});

module.exports = hbs;
