const cheerio = require("cheerio");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const exphbs = require("express-handlebars");
const Article = require("./models/articles.js");

const db = require("./models");



let PORT = process.env.PORT || 3000
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

let  MONGODB_URI = process.env.MONGODB_URI || "mongodb://root:root@192.168.99.100:27017/scrapah?authSource=admin";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrapah", function(req, res) {
  request("https://old.reddit.com/r/wow/", (error, response, html) => {
    if (error) {
      console.log(error);
    }

    const $ = cheerio.load(html);
    const results = [];

    $("div.top-matter").each(function(i, element) {
      let title = $(element)
        .children("p.title")
        .text();
      let link = $(element)
        .find("a.title")
        .attr("href");
      let numComments = $(element)
        .find("li.first")
        .text();
      let comments = $(element)
        .find("a.comments")
        .attr("href");

      results.push({
        title: title,
        link: link,
        amount: numComments,
        comments: comments
      });
      let article = new Article({
        title: title,
        link: link,
        amount: numComments,
        comments: comments
      });
      article.save();
    });

    res.redirect("/");
  });
});

app.get("/clear", function(req, res) {
  db.Article.remove({}).then(function() {
    res.redirect("/scrapah");
  });
});

app.get("/", function(req, res) {
  db.Article.find({}).then(function(data) {
    res.render("index", { items: data });
  });
});

app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    // ..and populate all of the notes associated with it

    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/notes/:id", function(req, res) {
  db.Note.findOne({ _id: req.params.id }).then(function(dbNote) {
    res.json(dbNote);
  });
});

app.post("/notes/:id", function(req, res) {
  db.Note.create(req.body).then(function(dbNote) {
    return db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { note: dbNote._id } },
      { new: true }
    );
  });
});

app.post("/update/:id", function(req, res) {
  db.Note.findByIdAndUpdate(
    req.params.id,
    { $set: { title: req.body.title, text: req.body.text } },
    { new: true },
    function(err, note) {
      if (err) return handleError(err);
      res.send(note);
    }
  );
});

app.post("/remove/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id }, function() {}).then(function() {});
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
