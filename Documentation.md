********app.js*****************

var express = require('express'),
    dogs    = require('./routes/dogs'),
    cats    = require('./routes/cats'),
    birds   = require('./routes/birds');

var app = express();

app.use('/dogs',  dogs);
app.use('/cats',  cats);
app.use('/birds', birds);

app.listen(3000);


**********dogs.js**************

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    res.send('GET handler for /dogs route.');
});

router.post('/', function(req, res) {
    res.send('POST handler for /dogs route.');
});

module.exports = router;

******************Explanation******************

When var router = express.Router() is called, a slightly different mini app is returned. The idea behind the mini app is that each route in your app can become quite complicated, and you'd benefit from moving all that code into a separate file. Each file's router becomes a mini app, which has a very similar structure to the main app.

In the example above, the code for the /dogs route has been moved into its own file so it doesn't clutter up the main app. The code for /cats and /birds would be structured similarly in their own files. By separating this code into three mini apps, you can work on the logic for each one in isolation, and not worry about how it will affect the other two.

If you have code (middleware) that pertains to all three routes, you can put it in the main app, before the app.use(...) calls. If you have code (middleware) that pertains to just one of those routes, you can put it in the file for that route only.


*****************Enviorment Variables********************

Environment variables exist outside our application's code, they are available where our application is running. They can be used to decouple our application's configuration from its code, which allows our apps to be easily deployed across different environments.

With Node.js apps, environment variables are available through the process.env global variable. We can set the environment variables before we run the node command, or we can use the dotenv library which allows us to define our environment variables in a .env file.

The .env file should never be in the source code repository.




*******************Mongosee Vs MongoDB******************************

In terms of Node.js, mongodb is the native driver for interacting with a mongodb instance and mongoose is an Object modeling tool for MongoDB.
Mongoose is built on top of the MongoDB driver to provide programmers with a way to model their data.
Mongoose is one of the orm's who give us functionality to access the mongo data with easily understandable queries.
Mongoose plays as a role of abstraction over your database model.