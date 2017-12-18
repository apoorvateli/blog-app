var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose");

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// MONGOOSE/MODEL CONFIG SCHEMA SETUP

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now
  }
});

var Blog = mongoose.model("Blog", blogSchema);
/*
Blog.create(
  {
    title: "Why Prices for Gadgets Are Diving in the Age of Amazon",
    image: "https://cdn-images-1.medium.com/max/1000/1*NIehoFi4kDSLtLhmTZe-uA.jpeg",
    body: "A few weeks ago, Wyze Labs, a 1-year-old startup in Seattle, sent me its first gadget to try. It’s a small, internet-connected video camera, the kind you might use for security or to keep tabs on your dog or your baby. On the surface, the camera doesn’t sound special. Like home internet cameras made by Nest or Netgear, the Wyze device can monitor an area for motion or sound. When it spots something, it begins recording a short clip that it stores online, for access on your phone or your computer. But the WyzeCam has one groundbreaking feature that no rival can match. It is being sold for such an unbelievably low price — $20 — that it sent me tunneling into the global gadget industry to figure out how Wyze had done it. That, in turn, led to a revelation about the future of all kinds of products, from cameras to clothes."
  },
  function(err, newBlog) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("Newly created blog:");
      console.log(newBlog);
    }
  }
);
*/

// RESTFUL ROUTES
app.get("/", function(req, res) {
  res.render("landing");
});

// INDEX - Display a list of all blogs
app.get("/blogs", function(req, res) {
  var blog = Blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("index", {blogs: blogs});
    }
  });
});

app.listen(3000, function() {
  console.log("Serving blog_app on port 3000");
})
