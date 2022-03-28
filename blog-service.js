// const fs = require("fs"); 

// var posts = [];
// var categories = [];

const Sequelize = require('sequelize');
var sequelize = new Sequelize("d1beljnlb2sklq", "rsjkwyzcphzwip", "94acfb75a02d8c835c8e08694d7cbe1208004ab14bf979037266632b22ef7b92", {
    host: 'ec2-44-194-92-192.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});
var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        sequelize.authenticate().then(function(){
            resolve()
        }).catch(function(){
            reject("unable to sync the database")
        });
    });
}

module.exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {

            Posts.findAll().then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
        });
    });

};
module.exports.getPublishedPosts = function() {
    sequelize.sync().then(function () {
        Posts.findAll({
            where: {
                published: true //might be ID
            }
        }).then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });

};
module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        reject();
});

}

module.exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function (categoryID) {
            Posts.findAll({
                where: {
                    category: categoryID //might be ID
                }
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
        });
});
}

module.exports.getPublishedPostsByCategory = (categoryID) => {
    sequelize.sync().then(function () {
        Posts.findAll({
            where: {
                published: true,
                category : categoryID
            }
        }).then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });

}

module.exports.getPostsByMinDate = (minDateStr) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function (categoryID) {
            const { gte } = Sequelize.Op;
            Posts.findAll({
                where: {
                    postDate:{[gte]: new Date(minDateStr)}
                }
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
        });
    });
}

module.exports.getPostById = (id) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function (postID) {
            Posts.findAll({
                where: {
                    id: postID //might be ID
                }
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
        });
    });
}

module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {
            Category.findAll().then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
        });
    });
}

module.exports.addPost = (postData) => {
    postData.published = (postData.published) ? true : false;
    for (const prop in obj) {
        if(prop == ""){
            prop = null;
        }
    }
    postData.postDate = new Date();
    Post.create({
        body: postData.body,
        title: postData.title,
        postDate: postData.postDate,
        featureImage: postData.featureImage,
        published: postData.published
    }).then(function (post) {
        resolve(post)
    }).catch(function(){
        reject("unable to create post");
    });
}