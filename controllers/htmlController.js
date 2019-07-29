const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {
  app.get("/scrape", (req, res) => {
    axios.get("https://www.theonion.com/").then(response => {
      let $ = cheerio.load(response.data);

      let results = [];

      $("article").each(function (i, element) {
        let result = {};

        result.title = $(this)
          .find("a")
          .children("h1")
          .text();
        result.link = $(this)
          .find("figure")
          .children("a")
          .attr("href")
        result.notes = [];

        console.log(result)
        results.push(result)

        if (result.link) {
          db.Article.create(results, { unordered: true })
            .then(dbArticles => {
              console.log('added new articles' + dbArticles);
              res.send('scapre done')
            })
            .catch(err => {
              console.log(err);
              res.send(err);
            })
        }
      })
    });
  })
  app.get("/", function(req, res) {
    db.Article.find({}).sort({_id: -1})
      .then(dbArticles => {
        res.render("index", { dbArticles });
      })
      .catch(err => {
        res.json(err);
      });
  });
  
}

