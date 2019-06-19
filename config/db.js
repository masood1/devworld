const mongoos = require("mongoose");
const config = require("config");

const dbUri = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoos.connect(dbUri, {
      useNewUrlParser: true
    });
    console.log("Mongo Db is connected");
  } catch (err) {
    console.error(err.message);
    //Exit process on process failure
    process.exit(1);
  }
};

module.exports = connectDB;
