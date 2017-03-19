var colors = require("colors");

const authorize = require("./lib/authorize")
const { readTemplate, compile } = require("./lib/template");
const { saveDescription } = require("./lib/reddit")

const ora = require("ora");

const spinner = ora("Initalizing...").start();

// Get authorized and read the template at the same time
Promise.all([
  authorize(),
  readTemplate("template.hbs")
])
  // Schedule rewrites from the spreadsheet
  .then(function(res) {
    spinner.text = "Starting update schedule..."
    let [auth, template] = res;
    setInterval(function() {
      spinner.text = "Compiling template..."
      // Recompile the template, and save the result
      compile(template, auth)
        .then(template => {
          spinner.text = "Updating subreddit..."
          return template
        })
        .then(saveDescription("1200isplentyketo"))
        .then(() => spinner.text = "Uploaded! Waiting for cooldown...")
        .catch(console.error);
    }, 1000 * 10) // <== Update every 30 seconds
  })
  .catch(console.log)
