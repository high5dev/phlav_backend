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

const mongoose = require("mongoose");
require("dotenv").config();

const URI = process.env.DBURL;
let connectionTry = 0;
const connectDB = (() => {
    var ref = _async_data_mongo(function* () {
        yield mongoose.connect(
            URI,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
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
    });

    return function connectDB() {
        return ref.apply(this, arguments);
    };
})();

module.exports = connectDB;
