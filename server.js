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

app.get("/", function(req,res){
  res.send("Hello world")
})


app.listen(6000, function() {
  console.log("App listening on: http://localhost:6000");
});
