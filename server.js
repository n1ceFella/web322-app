/*********************************************************************************
*  WEB322 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Volodymyr Labliuk Student ID: 147302202 Date: 29.03.2022
*
*  Online (Heroku) URL: https://afternoon-temple-65298.herokuapp.com/
*
*  GitHub Repository URL: https://github.com/n1ceFella/web322-app
*
********************************************************************************/ 


const express = require("express");
// const { listen } = require("express/lib/application");
// const { send } = require("express/lib/response");
const _path = require("path");
const _blogService = require("./blog-service");
const _server = express();
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const exphbs = require('express-handlebars');
const stripJs = require('strip-js');
const { resolve } = require("path");
_server.use(express.urlencoded({extended: true}));
const authData = require("./auth-service");
const clientSessions = require("client-sessions");




cloudinary.config({
    cloud_name: 'ditgfy779',
    api_key: '491122215765764',
    api_secret: 'Bj-gmH3D9nxJ7c-68oJ80GwtC6U',
    secure: true
});

_server.engine('.hbs', exphbs.engine({ 
    extname: '.hbs', 
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == _server.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function(context){
            return stripJs(context);
        },
        formatDate: function(dateObj){
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2,'0')}`;
        }  
    }
}));

_server.set('view engine', '.hbs');

const upload = multer(); // no { storage: storage } since we are not using disk storage

const HTTP_PORT = process.env.PORT || 8080;

_server.use(express.static('public')); 

function onHttpStart() {
    console.log("Express http server listening on port: " + HTTP_PORT);
}

//Once this is complete, incorporate the following custom middleware function to ensure that 
//all of your templates will have access to a "session" object (ie: {{session.userName}} for
// example) - we will need this to conditionally hide/show elements to the user depending on
// whether they're currently logged in.
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });
  

_server.use(function(req,res,next){
    let route = req.path.substring(1);
    _server.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/, "");
    _server.locals.viewingCategory = req.query.category;
    next();
});

_server.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "week10example_web322", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));

  function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }

_server.get("/login", function (req, res) { //  ensureLogin,
    res.render("login", {
      data: null,
      layout: "login.hbs",
    });
});

_server.get("/register", function (req, res) {
    res.render("register", {
      data: null,
      layout: "register.hbs",
    });
});

_server.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/");
  });

  _server.get("/userHistory", ensureLogin, function (req, res) {
    res.render("userHistory", {
      data: null,
      layout: "userHistory.hbs",
    });
});

_server.post("/register", ensureLogin, (req, res) => {
    authData.registerUser(req.body.userData).then(() => {
        res.render("register.hbs", {successMessage: "User created"}); //????????????????????????????????????????
      }).catch((err) => {
        res.render("register.hbs", {errorMessage: err, userName: req.body.userName});
      });
});
 
_server.get("/", (req, res) => {
    res.redirect('/blog');
});

_server.get("/about", (req, res) => {
    res.render('about', {
        data: null,
        layout: 'main.hbs' // do not use the default Layout (main.hbs)
    });
});

_server.get("/posts/add", ensureLogin, function (req, res) {

        _blogService.getCategories().then((data) => {
            res.render("addPost", {categories:data});
    }).catch((err) => {
        res.render("addPost", {categories:[]});
    })
});

_server.get("/categories/add", ensureLogin, function (req, res) {
    res.render("addCategory", {
      data: null,
      layout: "main",
    });
});

_server.post("/posts/add", ensureLogin, upload.single("featureImage"), (req, res) => {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                     } else {
                        reject(error);
                    }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
        // TODO: Process the req.body and add it as a new Bloclg Post before redirecting to /posts
        _blogService.addPost(req.body).then(() => {
            res.redirect('/posts')
        }).catch((error) => {
            res.status(500).send(error)
        });
    });
});


_server.post("/categories/add", ensureLogin, (req, res) => {
    _blogService.addCategory(req.body).then(() => {
        res.redirect("/categories");
      }).catch((error) => {
        res.status(500).send(error);
      });
  });

_server.get('/blog', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};

    try{
        // declare empty array to hold "post" objects
        let posts = [];
        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await _blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await _blogService.getPublishedPosts();
        }
        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
        // get the latest post from the front of the list (element 0)
        let post = posts[0]; 
        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
        viewData.post = post;
    }catch(err){
        viewData.message = "no results";
    }
    try{
        // Obtain the full list of "categories"
        let categories = await _blogService.getCategories();
        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }

    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})

});

_server.get("/posts", ensureLogin, (req, res) => {
    if(req.query.category){
        _blogService.getPostsByCategory(req.query.category).then((data) => {
            if(data.length > 0)
                res.render("posts", {posts:data});
            else 
                res.render("posts", {message: "no results"});
        }).catch((err) => {
            res.render("posts", {message: "no results"});
        })
    } else if(req.query.minDate) {
        _blogService.getPostsByMinDate(req.query.minDate).then((data) => {
            if(data.length > 0)
                res.render("posts", {posts:data});
            else 
                res.render("posts", {message: "no results"});
        }).catch((err) => {
            res.render("posts", {message: "no results"});
        })
    } else {
        _blogService.getAllPosts().then((data) => {
            if(data.length > 0)
                res.render("posts", {posts:data});
            else 
                res.render("posts", {message: "no results"});
        }).catch((err) => {
            res.render("posts", {message: "no results"});
        })
    }
});

_server.get('/blog/:id', async (req, res) => {
    // Declare an object to store properties for the view
    let viewData = {};
    try{
        // declare empty array to hold "post" objects
        let posts = [];

        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            posts = await _blogService.getPublishedPostsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            posts = await _blogService.getPublishedPosts();
        }
        // sort the published posts by postDate
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
        // store the "posts" and "post" data in the viewData object (to be passed to the view)
        viewData.posts = posts;
    }catch(err){
        viewData.message = "no results";
    }
    try{
        // Obtain the post by "id"
        viewData.post = await _blogService.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }
    try{
        // Obtain the full list of "categories"
        let categories = await _blogService.getCategories();
        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }
    // render the "blog" view with all of the data (viewData)
    res.render("blog", {data: viewData})
});

_server.get("/categories", ensureLogin, (req, res) => {
    _blogService.getCategories().then((data) => {
        if(data.length > 0)
            res.render("categories", {categories:data});
        else
            res.render("categories", {message: "no results"});
    }).catch((err) => {
        res.render("categories", {message: "no results"});
    })
});

_server.get("/categories/delete/:id", ensureLogin, (req, res) => {
    _blogService.deleteCategoryById(req.params.id).then(() => {
        resolve();
        res.redirect('/categories');
    }).catch(() => {
        res.status(500).send(error);
        reject("Unable to Remove Category / Category not found)");
    })
});

_server.get("/posts/delete/:id", ensureLogin, (req, res) => {
    _blogService.deletePostById(req.params.id).then(() => {
        resolve();
        res.redirect('/posts');
    }).catch(() => {
        res.status(500).send(error);
        reject("Unable to Remove Post / Post not found)");
    })
});

_server.get("*", (req, res) => {
    res.sendFile(_path.join(__dirname, "./views/error.html"));
})

_blogService.initialize().then(authData.initialize).then(() => {
    _server.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
    res.status(404).send("File couldn't be read");
});