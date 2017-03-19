var promisedHandlebars = require("promised-handlebars");
var handlebars = promisedHandlebars(require("handlebars"), { Promise: Promise });
var fs = require("fs");
var google = require('googleapis');
var sheets = google.sheets('v4');

// The Google Sheet to get the data from
var document = "1LYLvudPrgyceTayA6Dkv4GcEOtMzJYfoXMKZC4t-L6U"

// Store auth in global scope, so helpers can use it
global.auth = null;

handlebars.registerHelper("getCell", function (value) {
  return new Promise(function(resolve, reject) {
    sheets.spreadsheets.values.get({
      spreadsheetId: document,
      range: value,
      auth
    }, function(err, val) {
      if(err) reject(err)
      if (!val) reject(new RangeError("Unknown Cell", value))
      resolve(val.values[0][0])
    })
  }).catch(console.log);
})

/**
 * Given an array of values, and a starting and ending column name, it returns an object with the correct column name in that value
 * @method makeContext
 * @param  {Array}     values The Values to iterate over
 * @param  {String}    start  The starting column, e.g. "A"
 * @return {Object}           The final object with like {"<start>":<0th value>,...,"<end>":<last value>}
 */
function makeContext(values, start) {
  let out = {};
  let startCode = start.charCodeAt(0);
  values.forEach(v => {
    out[String.fromCharCode(startCode++)] = v
  });
  return out
}

function compose(values, options, value) {
  // First, get the columns
  return Promise.all(values.map(v => options.fn(makeContext(v, value.split(":")[0][0])))).then(v=>v.join(""));
}
handlebars.registerHelper("getRows", function (value, options) {
  return new Promise(function(resolve, reject) {
    sheets.spreadsheets.values.get({
      spreadsheetId: document,
      range: value,
      auth
    }, function(err, val) {
      if(err) reject(err)
      if (!val) reject(new RangeError("Unknown Cell", value))
      resolve(
        compose(val.values, options, value)
      )
    })
  }).catch(console.log);
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
