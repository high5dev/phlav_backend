"use strict";

var express = require("express");

var bodyParser = require("body-parser");

var cors = require("cors");

var apiFilter = require("./api/api-filter");

var authApi = require("./api/auth");

var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("../swagger.json");

require("dotenv").config();

var connectDB = require("./db/db-mongo.js");

var app = express();
connectDB(); // setup server port

var port = process.env.PORT || 8080; // use it before all route definitions

app.use(cors()); // configure bodyparser to handle post requests

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use("/report", apiFilter);

var _require = require("express-openid-connect"),
  auth = _require.auth;

var config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: "http://localhost:8080",
  clientID: "s2bsIm9J9pCTmZ1xwYkr4VOIqmUgRXPu",
  issuerBaseURL: "https://helpquit.eu.auth0.com"
}; // auth router attaches /login, /logout, and /callback routes to the baseURL

app.use(auth(config));
app.use("/user", authApi);
app.get("/", function (req, res) {
  res.json({
    status: "TEST OK",
    message:
      "Welcome to ASNSI API, Documentation refer: https://asnsi.io/api-docs/"
  });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", function (req, res) {
  res.json({
    status: "Test Ok",
    message:
      "Welcome to ASNSI API, Documentation refer: https://asnsi.io/api-docs/"
  });
});
app.listen(port, function () {
  console.log("App upload in port: " + port);
});
