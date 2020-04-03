var express             = require("express"),
methodOverride          = require("method-override"),
expressSanitizer        = require("express-sanitizer"),
mongoose                = require("mongoose"),
bodyParser              = require("body-parser"),
app                     = express();

//CONNECT TO THE azure
// const config = require('./config');
// var azure = require('azure-storage');
// var queueSvc = azure.createQueueService(config.azureStorageAccount, config.azureStorageAccessKey)
// const CosmosClient = require("@azure/cosmos").CosmosClient

// queueSvc.createQueueIfNotExists('queue', (error, result, response) => {
//     if(error) {
//         console.log(error)
//     }
//     if(result.created) {
//         console.log("Queue created.")
//     }
// })

// endpoint = config.endpoint
// key = config.key
// const client = new CosmosClient({endpoint, key});
// const userdatabase = client.database(config.userdatabaseId)
// const usercontainer = userdatabase.container(config.usercontainerId)
// const locationdatabase = client.database(config.locationdatabaseId)
// const locationcontainer = locationdatabase.container(config.locationcontainerId)
// const subscribercontainer = locationdatabase.container(config.subscribercontainerId)

//New try to microsoft azure

const cosmos = require("@azure/cosmos");
const CosmosClient = cosmos.CosmosClient;
const endpoint = "https://loc-123.mongo.cosmos.azure.com:443/";
const masterKey = "rpFWjehQ6JvKWheCvZtLYK85CeWiWR7PfSckIZgio8XYGKcblKP2uQoeCFEFCWmOP0V7a2duQ0qBc2hmfVR3pA=="
const client = new CosmosClient({endpoint, auth:{masterKey}});
const databaseId ="addlocation";
const containerId = "locationNew";


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://<username>:<password>@<endpoint>.documents.azure.com:10255/?ssl=true';

var insertDocument = function(db, callback) {
    db.collection('location').insertOne( {
            "id": "111",
            "locationName":"123",
        }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the families collection.");
        callback();
    });
    };


//REST API Starts here
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

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
        // mongoose.connect("mongodb://localhost/restful_blog_app");
mongoose.connect("mongodb://loc-123:rpFWjehQ6JvKWheCvZtLYK85CeWiWR7PfSckIZgio8XYGKcblKP2uQoeCFEFCWmOP0V7a2duQ0qBc2hmfVR3pA==@loc-123.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@loc-123@", { useNewUrlParser: true })        
//app.set('views', '/index');
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// var findFamilies = function(db, callback) {
//     var cursor =db.collection('location').find( );
//     cursor.each(function(err, doc) {
//         assert.equal(err, null);
//         if (doc != null) {
//             console.dir(doc);
//         } else {
//             callback();
//         }
//     });
//     };

// Mongoose/model config
var blogSchema = new mongoose.Schema({
    id: String,
    locationName: String,
    locationType: String,
    description: String,
    elat: String,
    elon: String,
    range: String,
    altitude: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


//new database schema 
// var Blog = mongoose.model("Blog")
// var Blog = function(db, callback) {
//     var cursor = db.collection('location').find( );
//     cursor.each(function(err, doc) {
//         assert.equal(err, null);
//         if (doc != null) {
//             console.dir(doc);
//         } else {
//             callback();
//         }
//     });
//     };

//     async function run() {

//         const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec, { enableCrossPartitionQuery: true }).toArray();
    
//         for (var queryResult of results) {
//             let resultString = JSON.stringify(queryResult);
//             console.log(`\tQuery returned ${resultString}\n`);
//         }
//     }

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
//  app.get('/locations', async(request, response) => {
//     try{
//         const querySpec = {
//             query: "SELECT * from c"
//         };
//         //Query is performed in the container specified and the result is stored in items
//         const { resources: items } = await locationcontainer.items
//             .query(querySpec)
//             .fetchAll();
//         //The result is sent to the client.
//         response.json(items)
//         console.log('List of Admin added locations sent!')
//     } catch(err) {
//         console.log(err)
//         return response.send('Error occured!\n');
//     }
// });
 
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

