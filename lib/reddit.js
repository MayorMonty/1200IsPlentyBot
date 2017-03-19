var snoowrap = require("snoowrap");
var auth = require("../auth/reddit.json")

const r = new snoowrap(auth)

function saveDescription(subreddit) {
  return function(description) {
    return r.getSubreddit(subreddit).editSettings({
      description
    });
  }
}

module.exports = {
  saveDescription
}
