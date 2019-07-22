// Dependencies
const express = require("express");
const mongojs = require("mongojs");
const axios = require("axios");
const cheerio = require("cheerio");
// Require axios and cheerio. This makes the scraping possible


// Initialize Express
const app = express();

// Database configuration
const databaseUrl = "scraper";
const collections = ["scrapedData"];

const db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error", error);
});

app.get("/", function (req, res) {
  res.send("Hello world")
})

app.get("/all", function (req, res) {
  db.scrapedData.find({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});


app.listen(4000, function () {
  console.log("App listening on: http://localhost:4000");
});


app.get("/scrape", function (req, res) {
  axios.get("https://www.theonion.com/").then(function (response) {
    const $ = cheerio.load(response.data);

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

      console.log(result)
      results.push(result)
    });

    db.scrapedData.insert(results, function(err, inserted){
      if(err) {
        console.log(err);
      }
      else {
        console.log(inserted)
      }
    })
    


      // .then(dbScrapedData => {
      //   console.log("Articles added" + dbScrapedData);
      //   res.send("scrape done");
      // })
      // .catch(err => {
      //   console.log(err);
      //   res.send(err);
      // })
  })
  res.send("scrape done")
})
