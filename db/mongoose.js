var mongoose = require("mongoose");

//Use promises
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGOLAB_CRIMSON_URI || "mongodb://localhost:27017/UserApp");

module.exports = {mongoose};