/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Volodymyr Labliuk Student ID: 147302202 Date: 21.02.2022
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

_server.use(function(req,res,next){
    let route = req.path.substring(1);
    _server.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/, "");
    _server.locals.viewingCategory = req.query.category;
    next();
});

 
_server.get("/", (req, res) => {
    res.redirect('/about');
});

_server.get("/about", (req, res) => {
    var someData = {
        name: "Volodymyr",
        age: 31,
        occupation: "developer",
        company: "self employed"
    };
    
    res.render('about', {
        data: someData,
        layout: 'main.hbs' // do not use the default Layout (main.hbs)
    });
});

_server.get("/posts/add", (req, res) => {
    var someData = {
        name: "Volodymyr",
        age: 31,
        occupation: "developer",
        company: "self employed"
    };
    
    res.render('about', {
        data: someData,
        layout: 'main.hbs' // do not use the default Layout (main.hbs)
    });
});

_server.post("/posts/add",upload.single("featureImage") , (req, res) => {
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
    
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        _blogService.addPost(req.body).then(() => {
            res.redirect('/posts')
        }).catch((error) => {
            res.status(500).send(error)
        });
    });
    
    //_blogService.addPost()
});

_server.get("/blog", (req, res) => {
    _blogService.getPublishedPosts().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json("Error message : " + err);
    })
});

_server.get("/posts", (req, res) => {
    if(req.query.category){
        _blogService.getPostsByCategory(req.query.category).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json("Error message : " + err);
        })
    } else if(req.query.minDate) {
        _blogService.getPostsByMinDate(req.query.minDate).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json("Error message : " + err);
        })
    } else {
        _blogService.getAllPosts().then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json("Error message : " + err);
        })
    }
});

_server.get("/posts/:id", (req, res) => {
    _blogService.getPostsById(req.params.id).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json("Error message : " + err);
    })
});

_server.get("/categories", (req, res) => {
    _blogService.getCategories().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json("Error message : " + err);
    })
});

_server.get("*", (req, res) => {
    res.sendFile(_path.join(__dirname, "./views/error.html"));
})

_blogService.initialize().then(() => {
    _server.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
    res.status(404).send("File couldn't be read");
});