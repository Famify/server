const mongoose = require("mongoose");

// let mongoUri = `mongodb://localhost:27017/famify-${process.env.NODE_ENV}`
let mongoUri = process.env.MONGO_URI;

const mongoConfig = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose.connect(mongoUri, mongoConfig, function(err) {
  err ? console.log("db disconnected") : console.log("db connected");
});
