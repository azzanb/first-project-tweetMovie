var mongoose = require("mongoose");
var MongoClient = require('mongodb').MongoClient;

//Use promises
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/UserApp");

module.exports = {mongoose};