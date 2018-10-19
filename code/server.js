const cheerio = require("cheerio");
const mongoose = require("mongoose");
const express = require("express");
var request = require("request");
const db = require("./models");

let PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(
  "mongodb://root:root@192.168.99.100:27017/scrapah?authSource=admin", { useNewUrlParser: true }
);

request("https://old.reddit.com/r/wow/", (error, response, html) => {
  if (error) {
    console.log(error);
  }

  const $ = cheerio.load(html);

  const results = [];

  $("div.top-matter").each(function(i, element) {
    let title = $(element).children("p.title").text();
    let link = $(element).find("a.title").attr("href");
    let numComments = $(element).find("li.first").text();
    let comments = $(element).find("a.comments").attr("href");
    

    results.push({
      title: title,
      link: link,
      amount: numComments,
      comments: comments
    });
  });

  console.log(results);
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
