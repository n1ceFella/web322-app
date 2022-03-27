// const fs = require("fs"); 

// var posts = [];
// var categories = [];

const Sequelize = require('sequelize');
var sequelize = new Sequelize('d1beljnlb2sklq', 'rsjkwyzcphzwip', '94acfb75a02d8c835c8e08694d7cbe1208004ab14bf979037266632b22ef7b92', {
    host: 'ec2-44-194-92-192.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        reject();
});

}

module.exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {
        reject();
});

};
module.exports.getPublishedPosts = function() {
    return new Promise((resolve, reject) => {
        reject();
});

};
module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        reject();
});

}

module.exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        reject();
});

}

module.exports.getPublishedPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        reject();
});

}

module.exports.getPostsByMinDate = (minDateStr) => {

    return new Promise((resolve, reject) => {
        reject();
});

}

module.exports.getPostById = (id) => {
    return new Promise((resolve, reject) => {
        reject();
});
}

module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        reject();
});
}