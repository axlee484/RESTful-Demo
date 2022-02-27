const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.listen(2403);

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleScema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: "" },
});
const Article = mongoose.model("Article", articleScema);

app.get("/articles", (req, res) => {
  Article.find({}, function (err, Articles) {
    if (err) {
      res.send(err);
      return;
    }
    res.send(Articles);
  });
});

app.post("/articles", (req, res) => {
  Article.findOne({ title: req.body.title }, function (err, _article) {
    if (err) return;
    if (_article) {
      res.send("Already saved");
      return;
    }

    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article.save();
    res.send("saved" + article);
  });
});
