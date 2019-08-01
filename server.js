// Dependencies
require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars")
const app = express();

const PORT = process.env.PORT || 4000;
console.log("process.env.PORT = " + process.env.PORT);
console.log("PORT = " + PORT);

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/dataScraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


require("./controllers/htmlController")(app);

app.listen(PORT, function () {
  console.log("App listening on: http://localhost:4000");
});
