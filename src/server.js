const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const apiFilter = require("./api/api-filter");
const authApi = require("./api/auth");
const swaggerUi = require("swagger-ui-express"),
    swaggerDocument = require("../swagger.json");
require("dotenv").config();

const connectDB = require("./db/db-mongo.js");

let app = express();

connectDB();

// setup server port
const port = process.env.PORT || 8080;

// use it before all route definitions
app.use(cors());

// configure bodyparser to handle post requests
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(bodyParser.json());
app.use("/report", apiFilter);
const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: 'http://localhost:8080',
    clientID: 's2bsIm9J9pCTmZ1xwYkr4VOIqmUgRXPu',
    issuerBaseURL: 'https://helpquit.eu.auth0.com',
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use("/user", authApi);
app.get("/", function (req, res) {
    res.json({
        status: "Test Ok",
        message:
            "Welcome to ApiFilter API, Documentation refer: https://url-filter.herokuapp.com/api-docs/",
    });
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", function (req, res) {
    res.json({
        status: "Test Ok",
        message:
            "Welcome to ApiFilter API, Documentation refer: https://url-filter.herokuapp.com/api-docs/",
    });
});

app.listen(port, function () {
    console.log("App upload in port: " + port);
});
