var express             = require("express"),
methodOverride          = require("method-override"),
expressSanitizer        = require("express-sanitizer"),
mongoose                = require("mongoose"),
bodyParser              = require("body-parser"),
app                     = express();


// const http = require('http');
// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//     res.stausCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Helle World');
// });

// server.listen(port, hostname, () => {
//     console.log('Server running at http;//${hostname:${port}/');
// });

//app config
mongoose.connect("mongodb://localhost/restful_blog_app");
//app.set('views', '/index');
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES
// Blog.create({
//     title : "Test Blog",
//     image: "https://images.unsplash.com/photo-1582728961836-1e3d66c3f374?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
//     body: "Hello this is a blog post: "
// }); 
app.get("/", function(req, res){
    res.redirect("/blogs"); 
 });
 
 // INDEX ROUTE
 app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
           res.render("index", {blogs: blogs}); 
        }
    });
 });
 
 // NEW ROUTE
 app.get("/blogs/new", function(req, res){
     res.render("new");
 });
 
 // CREATE ROUTE
 app.post("/blogs", function(req, res){
     // create blog
     console.log(req.body);
     
     console.log("============");
     console.log(req.body);
     Blog.create(req.body.blog, function(err, newBlog){
         if(err){
             res.render("new");
         } else {
             //then, redirect to the index
             res.redirect("/blogs");
         }
     });
 });
 
 // SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
     });
});

// edit ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

// update rotue
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    });
});

// delete route
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});


var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function(){
    console.log("SERVE IS RUNNING");
});

