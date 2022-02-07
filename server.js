const express = require("express");
// const { listen } = require("express/lib/application");
// const { send } = require("express/lib/response");
const _path = require("path");
const _blogService = require("./blog-service");
const _server = express();

const HTTP_PORT = process.env.PORT || 8080;

_server.use(express.static('public')); 

function onHttpStart() {
    console.log("Express http server listening on port: " + HTTP_PORT);
}
 
_server.get("/", (req, res) => {
    res.redirect('/about');
});

_server.get("/about", (req, res) => {
    res.sendFile(_path.join(__dirname, './views/about.html'));
});

_server.get("/blog", (req, res) => {
    _blogService.getPublishedPosts().then((data) => {
        res.json(data);
    }).catch((err) => {
        return {"Error message": err.message};
    })
})

_server.get("/posts", (req, res) => {
    _blogService.getAllPosts().then((data) => {
        res.json(data);
    }).catch((err) => {
        return {"Error message": err.message};
    })
})

_server.get("/categories", (req, res) => {
    _blogService.getCategories().then((data) => {
        res.json(data);
    }).catch((err) => {
        return {"Error message": err.message};
    })
})

_server.get("*", (req, res) => {
    res.sendFile(_path.join(__dirname, "./views/error.html"));
})

_blogService.initialize().then(() => {
    _server.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
    res.status(404).send("File couldn't be read");
})