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
db.on("error", function(error) {
  console.log("Database Error", error);
});

app.get("/", function(req, res){
  res.send("Hello world")
})

app.get("/all", function(req, res) {
  db.scrapedData.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else{
      res.json(found);
    }
  });
});


app.listen(4000, function() {
  console.log("App listening on: http://localhost:4000");
});

// scraper needs to scrape: headline / summary / url 
  // need to use axios to call the site and return a response
  // parse response.data using cheerio
  //  document.querySelector("#site-content > div:nth-child(3) > div:nth-child(5)")
app.get("/scrape", function(req, res) {
  axios.get("https://www.theonion.com/").then(function(response){
    const $ = cheerio.load(response.data);
  
    // title of article
    // $(".sc-759qgu-0").each(function(i, element){
    //   var title = $(element).text();
    //   console.log(title)
    // })
    // $(".js_link sc-1out364-0 fwjlmD").each(function(i, element){
    //   var link = $(element).attr("href")
    //   console.log(link)
    // })
    // document.querySelector("body > div:nth-child(6) > div.sc-2d2qtd-0.dmSVnl > main > div > div.sc-17uq8ex-0.ljcHun")
    let results = [];
    
    $("article").each(function(i, element){
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
    })
  })
})
