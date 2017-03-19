var snoowrap = require("snoowrap");
var auth = require("../auth/reddit.json")

const r = new snoowrap(auth)

function saveDescription(desc) {


  return Promise.resolve();
}

module.exports = {
  saveDescription
}
