var promisedHandlebars = require("promised-handlebars");
var handlebars = promisedHandlebars(require("handlebars"), { Promise: Promise });
var fs = require("fs");

// Store auth in global scope, so helpers can use it
global.auth = null;

handlebars.registerHelper("getCell", function (value) {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve.bind(this, "Value"), 4000);
  });
})

// Register the auth into global scope before calling the actual compile function
function compile(template, auth) {
  global.auth = auth;
  return handlebars.compile(template)();
}


// Simple promise based file reading, just for Promise.all
function readTemplate(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, function(err, file) {
      if (err) reject(err);
      resolve(file.toString());
    });
  });
}

module.exports = {
  readTemplate,
  compile
}
