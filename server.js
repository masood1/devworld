const express = require("express");
const connectDb = require("./config/db");
const bodyparser = require("body-parser");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const auth = require("./routes/api/auth");
const post = require("./routes/api/posts");

const PORT = process.env.PORT || 5000;

const app = express();
//Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//connect databse
connectDb();

app.get("/", (req, res) => res.send("API running"));

//Define Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/auth", auth);
app.use("/api/posts", post);

app.listen(PORT, () => console.log("Server Started on port ${PORT}"));
