var fs = require("fs");
var readline = require("readline");
var google = require("googleapis");
var googleAuth = require("google-auth-library");
var http = require("http");
var ip = require("ip");

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
var TOKEN_DIR = "./credentials/";
var TOKEN_PATH = TOKEN_DIR + "sheets.json";


/**
 * Create an OAuth2 client with the given credentials, returns a promise with the token
 *
 */
function authorize() {
  return new Promise(function(resolve, reject) {
    var credentials = require("../auth/google.json");
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, resolve);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        resolve(oauth2Client);
      }
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {

  var authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });

  // Start a redirect server, for convience
  var server = http.createServer((req, res)=>{res.writeHead(301, {Location:authUrl});res.end()})
  server.listen(7800, function() {

    spinner.stop();
    console.log("Authorize this app by visiting this url: ", ip.address() + "7800");

    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`Enter the code from ${ip.address() + ":7800"} here: `, function(code) {
      rl.close();
      server.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log("Error while trying to retrieve access token", err);
          return;
        }
        spinner.start();
        oauth2Client.credentials = token;
        storeToken(token);
        callback(oauth2Client);
      });
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != "EEXIST") {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log("Token stored to " + TOKEN_PATH);
}



module.exports = authorize;
