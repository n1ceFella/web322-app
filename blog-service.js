const Sequelize = require('sequelize');
var sequelize = new Sequelize("da0dtvoi3cm5d", "xfbrjhkpqmngpv", "46196dd619e050a58d253fb5089152516fb241e7e69618429f7b19bd21705f53", {
    host: 'ec2-54-173-77-184.compute-1.amazonaws.com',
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
        sequelize.sync().then(function(){
            resolve()
        }).catch(function(error){
            reject("unable to sync the database : " + error)
        });
    });
}

module.exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {

            Post.findAll().then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
        //});
    });

};
module.exports.getPublishedPosts = function() {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true
            }
        }).then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });

};
module.exports.getCategories = () => {
    return new Promise((resolve, reject) => {
            Category.findAll().then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
    });
}

module.exports.getPostsByCategory = (categoryID) => {
    return new Promise((resolve, reject) => {
            Post.findAll({
                where: {
                    category: categoryID
                }
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
});
}

module.exports.getPublishedPostsByCategory = (categoryID) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
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
            const { gte } = Sequelize.Op;
            Post.findAll({
                where: {
                    postDate:{[gte]: new Date(minDateStr)}
                }
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
    });
}

module.exports.getPostById = (postID) => {
    return new Promise((resolve, reject) => {
            Post.findOne({
                where: {
                    id: postID
                }
            }).then(function(data){
                resolve(data);
            }).catch(function(){
                reject("no results returned");
            });
    });
}

module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        postData.published = (postData.published) ? true : false;
        for (prop in postData) {
            if(postData[prop] == ""){
                postData[prop] = null;
            }
        }
        postData.postDate = new Date();
        Post.create({
            body: postData.body,
            title: postData.title,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published,
            category: postData.category
        }).then(function (post) {
            resolve(post)
        }).catch(function(){
            reject("unable to create post");
        });
    });
}

module.exports.addCategory = (categoryData) =>{
    return new Promise((resolve, reject) => {
        for (prop in categoryData) {
            if(categoryData[prop] == ""){
                categoryData[prop] = null;
            }
        }
        Category.create({
            category: categoryData.category
        }).then(function (post) {
            resolve(post)
        }).catch(function(){
            reject("unable to create category");
        });
    });
}

module.exports.deleteCategoryById = (categoryID) => {
    return new Promise((resolve, reject) => {
        Category.destroy({
            where: { id: categoryID }
        }).then(function (data) {
            resolve(data)
        }).catch(function(){
            reject("error in category destroy method");
        });
    });
}
module.exports.deletePostById = (postID) => {
    return new Promise((resolve, reject) => {
        Post.destroy({
            where: { id: postID }
        }).then(function (data) {
            resolve(data)
        }).catch(function(){
            reject("error in post destroy method");
        });
    });
}