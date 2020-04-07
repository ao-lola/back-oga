const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

//set routes
const users = require("./routes/api/users");

const app = express();
const db = require("./config/keys").mongoURI;

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "example.com");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

//router use
app.use("/api/users", users);

mongoose
  .connect(db)
  .then(() => console.log("mongoDB is connected"))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is running on port ${port}`));
