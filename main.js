const authorize = require("./lib/authorize")
const { readTemplate, compile } = require("./lib/template");
const { saveDescription } = require("./lib/reddit")

const ora = require("ora");

// Start the CI server
require("./lib/ci");


var spinner = ora("Initalizing...").start();

// Get authorized and read the template at the same time
Promise.all([
  authorize(spinner),
  readTemplate("template.hbs")
])
  // Schedule rewrites from the spreadsheet
  .then(function(res) {
    spinner.succeed()
    spinner = ora("Starting update schedule...").start();
    let [auth, template] = res;
    setInterval(function() {
      spinner.succeed()
      spinner = ora("Compiling template...").start();
      // Recompile the template, and save the result
      compile(template, auth)
        .then(template => {
          spinner.succeed()
          spinner = ora("Uploading template...").start();
          return template
        })
        .then(saveDescription("1200isplentyketo")
        .then(() => {
          spinner.succeed()
          spinner = ora("Waiting for cooldown...").start();
        })
        .catch(e => spinner.fail(e) && process.exit(1));
    }, 1000 * 30) // <== Update every 30 seconds
  })
  .catch(e => spinner.fail(e))
