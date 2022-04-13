var mongoose = require("mongoose");
const { user } = require("pg/lib/defaults");
var Schema = mongoose.Schema;
var userSchema = new Schema({
  "userName":  {
    "type": String,
    "unique": true
  },
  "password": String,
  "email": String,
  "loginHistory": [{dateTime: Date, userAgent: String}]
});
let User; // to be defined on new connection (see initialize)

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb+srv://unix90:Vova1990@senecaweb.r7h38.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();

        });
    });
}

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if(userData.password != userData.password2){
            reject("Passwords do not match");
        }else {
            let newUser = new User(userData);
            newUser.save((err) => {
                if(err.code == 11000){
                    reject("User Name already taken");
                } else if(err.code != 11000){
                    reject("There was an error creating the user: " + err );
                }else resolve();
            });
        }
    });
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({userName: userData.userName}).exec()
        .then((users) => {
            if(users.length == 0)
                reject("Unable to find user:" + user );
            else if(users[0].password != userData.password)
                reject("Incorrect Password for user: " + userName);
            else {
                user[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent}); //check this
                User.updateOne(
                    { userName: user[0].userName},
                    { $set: { loginHistory: users[0].loginHistory } }
                  ).exec(users[0]);
                resolve(users[0])
            }
            reject("There was an error verifying the user: " + err);
        }).catch((err) => {
            reject(reject("There was an error verifying the user: " + userData.userName));
        });
    });
}