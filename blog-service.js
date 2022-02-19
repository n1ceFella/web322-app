const fs = require("fs"); 

var posts = [];
var categories = [];

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err) throw err;
            else {
                posts = JSON.parse(data,posts);
                fs.readFile('./data/categories.json', 'utf8', (err, data) => {  
                    if (err) throw err;
                    else {
                        categories = JSON.parse(data,categories);
                        console.log("data retrieved");
                        resolve("File has been read");
                    }
                })
            }                                                                                     
        })
    });
}

module.exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {
        posts.length == 0 ? reject('No results returned') : resolve(posts)
    })
};
module.exports.getPublishedPosts = function() {
    var temp = [];
    for (i = 0; i < posts.length; i++) {
        if (posts[i].published) {
            temp.push(posts[i]);
        }
    }
    return new Promise((resolve, reject) => {
        temp.length == 0 ? reject('No results returned') : resolve(temp); 
    });
};
module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        categories.length == 0 ? reject('No results returned') : resolve(categories) ; 
    });
}

module.exports.addPost = (postData) => {
    postData.id = posts.length + 1;
    postData.published == null ? 
    postData.published = false : postData.published = true;
    
    posts.push(postData);
    return new Promise((resolve, reject) => {
        resolve(); //might be posts
    });
}

module.exports.getPostsByCategory = (category) => {
    //var categoryList = [];
    
    return new Promise((resolve, reject) => {
        var categoryList = posts.filter(e => e.category == category);
        categoryList.length == 0 ? reject('No results returned') : resolve(categoryList); 
    });
}

module.exports.getPostsByMinDate = (minDateStr) => {
    //var dateList = [];
    
    return new Promise((resolve, reject) => {
        //var minDate = new Date(minDateStr);
        var dateList = posts.filter(e => new Date(e.postData) >= new Date(minDateStr)); //
        // if (dateList.length == 0) {
        //     reject('no results returned ');
        // }
        //resolve(dateList);
        dateList.length == 0 ? reject('No results returned') : resolve(dateList);
    });
}

module.exports.getPostsById = (id) => {
    //var flag = true;
    
    // for(i = 0; i < posts.length && flag; i++){
    //     if(posts[i].id == id){
    //         post = posts[i];
    //         flag = false;
    //     }
    // }
    return new Promise((resolve, reject) => {
        var post = posts.filter(e => e.id == id);
        post == null ? reject('No results returned') : resolve(post);
    });
}