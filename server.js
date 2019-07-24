// Dependencies
const express = require("express");
const logger = require("morgan");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const db = require("./models")
const PORT = 4000;
const app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/dataScraper", { useNewUrlParser: true });

app.get("/all", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle)
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/scrape", function (req, res) {
  axios.get("https://www.theonion.com/").then(function (response) {
    const $ = cheerio.load(response.data);

    let results = [];

    $("article").each(function (i, element) {
      const result = {};

      result.title = $(this)
        .find("a")
        .children("h1")
        .text();
      result.link = $(this)
        .find("figure")
        .children("a")
        .attr("href")

      // console.log(result)
      // results.push(result)
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err)
        })
    })
    res.send("scrape done")
  });
})

app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.listen(PORT, function () {
  console.log("App listening on: http://localhost:4000");
});
