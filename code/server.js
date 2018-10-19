const cheerio = require("cheerio");
const mongoose = require("mongoose");
const express = require("express");
const request = require("request");
const exphbs = require("express-handlebars");
const Article = require("./models/articles.js");
const Note = require("./models/notes.js")

const db = require("./models");

let PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));

mongoose.connect(
  "mongodb://root:root@192.168.99.100:27017/scrapah?authSource=admin",
  { useNewUrlParser: true }
);

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

    console.log(results);
    res.send("scrape complete");
  });
});

app.get("/all", function(req, res) {
  db.Article.find({}).then(function(data) {
    res.send(data);
  });
});

app.get("/clear", function(req, res) {
  db.Article.remove({}).then(function() {
    res.send("clear worked");
  });
});

app.get("/", function(req, res) {
  db.Article.find({}).then(function(data) {
    res.render("index", { items: data });
  });
});

// app.get("/add-note", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });
app.post("/add-note", function(req, res) {
  console.log(req.body);
  res.send("route is working");
  
  db.Note.create(req.body)
    .then(function(dbNote) {

      console.log("dbNote" + dbNote);
       db.Article.findOneAndUpdate(
        { _id: dbNote.buttonId },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
