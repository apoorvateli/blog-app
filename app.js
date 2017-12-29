var express = require("express"),
app = express(),
mongoose = require("mongoose"),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");

// APP CONFIG
mongoose.connect("mongodb://localhost/blog_app", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); // this code should be after using bodyParser
app.use(methodOverride("_method"));
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
    image: "https://media.licdn.com/media-proxy/ext?w=800&h=800&hash=WRuGzxIg3MAYQ0On6ZLqRVrPhro%3D&ora=1%2CaFBCTXdkRmpGL2lvQUFBPQ%2CxAVta5g-0R6nlh8Tw1Ek-L7T40O550NJC4HTDy_8DnHzq8jAIiihMNiKMfau41ASfCwXyAkwduy-Fj2_BMvtaNLiPr0y19GnMZKWYkJUTzIB1VxExfMjKwAUrKfjV8n8TzZNl798KyCvMuS4IgAcCwMV3tixKYzqJE029QSAW-nUP-51b_Iw05l79UpU8sqIRPhonYRyx0dw0Aek77zZBiwq_dj-W0eVJFkjOESSPqxhmr6Inya7uFaMmFvotImpP7yHGPEj-F6E0Lr7fBCy2VFBqFo9_T5Uo9pBB0frmfk8x2ajZNgmByeJ4cDnRE2K-pRH7DUk7eKRNyGxXGdEwxdt",
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
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("ERROR IN INDEX ROUTE:");
      console.log(err);
    }
    else {
      res.render("index", {blogs: blogs});
    }
  });
});

// NEW - Display a form to create new post
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

// CREATE - Create a new post in the db
app.post("/blogs", function(req, res) {
  // sanitize the data coming from new blog form - MIDDLEWARE
  req.body.blog.title = req.sanitize(req.body.blog.title);
  req.body.blog.image = req.sanitize(req.body.blog.image);
  req.body.blog.body = req.sanitize(req.body.blog.body);

  // create blog
  // Blog.create( dataFromForm, callback )
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render("/blogs/new");
      // console.log("ERROR:");
      // console.log(err);
    }
    else {
      // redirect to the index page
      res.redirect("/blogs");
    }
  });
});

// SHOW - Show info about one specific blog
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
      // console.log("ERROR:");
      // console.log(err);
    }
    else {
      res.render("show", {blog: foundBlog});
    }
  });
});

// EDIT - Display a form to edit a specific blog
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

// UPDATE - Update a specific blog in the DB
app.put("/blogs/:id", function(req, res) {
  // sanitize the data coming from edit blog form - MIDDLEWARE
  req.body.blog.title = req.sanitize(req.body.blog.title);
  req.body.blog.image = req.sanitize(req.body.blog.image);
  req.body.blog.body = req.sanitize(req.body.blog.body);

  // Blog.findByIdAndUpdate( id , newDataFromForm, callback )
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if (err) {
      // redirect to the EDIT page
      res.redirect("/blogs/" + req.params.id + "/edit");
    }
    else {
      // redirect to the SHOW page
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// DELETE - Delete/Remove a specific dog from the DB
app.delete("/blogs/:id", function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err, deletedBlog) {
    if (err) {
      res.redirect("/blogs");
    }
    else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, function() {
  console.log("Serving blog_app on port 3000");
});
