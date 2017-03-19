# 1200IsPlentyBot

### Installation
Run these commands on the server you want it to run

    git clone https://github.com/MayorMonty/1200IsPlentyBot/
    cd 1200IsPlentyBot
Then run either

    yarn
or

    npm install
depending on which is installed (prefer `yarn`)

Now install [PM2](http://pm2.keymetrics.io/), a process manager for Node (use `yarn add pm2 -g` if possible):

    npm i -g pm2

Finally, run

    pm2 start main.js --name "1200IsPlentyBot"


### Template Syntax

**TLDR: This uses handlebars.js for templates, with two helpers: `getCell`, and a block helper called `getRows`. Pass A1 notation to these helpers**

When editing the [template file](https://github.com/MayorMonty/1200IsPlentyBot/blob/master/template.hbs), there is a simple syntax to collect the data from the spreadsheet. Remember that, aside from the template syntax, this format is [Reddit Markdown](https://www.reddit.com/r/reddit.com/comments/6ewgt/reddit_markdown_primer_or_how_do_you_do_all_that/), the normal formatting that you use on Reddit. Take a look at the following simple example:

```handlebars
  # Hello {{ getCell "A1" }}!
```
Pretty simple, right? The `{{ getCell "A1" }}` gets the A1 cell, and uses its value there. Anything between `{{` and `}}` indicates to the template parser that this is a value it should replace.

Inside the `{{ ... }}`, there are currently two functions to get values from the spreadsheet, `getCell`, and a block functions called `getRows`. Think of block functions as mini templates that you place inside your template for when you're getting more then one item of content, in this case, multiple rows of content.

Take a look at this example of `getRows`:

```handlebars
Timestamp|Name|Walk/Run|Units|How Much|How Long (Days)
---|---|---|---|---|---
{{#getRows "A2:F116"}}
  {{A}} | {{B}} | {{C}} | {{D}} | {{E}} | {{F}}
{{/getRows}}

```
A little more complicated, but still pretty easy to understand. Here, I'm using Reddit's Table syntax to transpose a range from the spreadsheet into the sidebar! Up a the top, you can see the table header:

```markdown
Timestamp|Name|Walk/Run|Units|How Much|How Long (Days)
---|---|---|---|---|---
```
This is simple, it just establishes the column names, using [Reddit Markdown](https://www.reddit.com/r/reddit.com/comments/6ewgt/reddit_markdown_primer_or_how_do_you_do_all_that/). Just below is where it gets interesting:
```handlebars
{{#getRows "A2:F116"}}
  {{A}} | {{B}} | {{C}} | {{D}} | {{E}} | {{F}}
{{/getRows}}
```
This is telling my parser, *"OK, in the range A2:F116, for each row, render the following content."* The following content, of course is everything until `{{/getRows}}`, which indicates that everything is back to normal. Inside that content range though, things change slightly. Notice the `{{ A }}`? Remember that `{{ .. }}` is to be replaced by the parser. But `A` isn't one of our functions! In this *context*, the rules are different. `A` just renders whatever value is in the A column for this row, `B` renders what's in the B column, and so on.

That's all there is to it! If you have any questions, or need an additional feature, please [PM me](https://www.reddit.com/message/compose?to=/u/MayorMonty)
