"use strict";

function _async_data_mongo(fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(
            function (value) {
              return step("next", value);
            },
            function (err) {
              return step("throw", err);
            }
          );
        }
      }

      return step("next");
    });
  };
}

var mongoose = require("mongoose");

require("dotenv").config();

var URI = process.env.DBURL;
var connectionTry = 0;

var connectDB = (function () {
  var ref = _async_data_mongo(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return mongoose.connect(
                URI,
                {
                  useUnifiedTopology: true,
                  useNewUrlParser: true
                },
                function (err) {
                  if (err) {
                    console.log(
                      "Unable to connect to the server. Please start the server. Error : ",
                      err
                    );

                    if (connectionTry < 4) {
                      setTimeout(connectDB, 5000);
                      console.log("Intent: " + connectionTry);
                    }

                    connectionTry++;
                  } else {
                    console.log("Db connected..!");
                  }
                }
              );

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })
  );

  return function connectDB() {
    return ref.apply(this, arguments);
  };
})();

module.exports = connectDB;
