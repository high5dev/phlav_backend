"use strict";

function _asyncToGenerator(fn) {
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
          return Promise.resolve(value).then(function (value) {
            return step("next", value);
          }, function (err) {
            return step("throw", err);
          });
        }
      }
      return step("next");
    });
  };
}

function _async_data_filter(fn) {
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
          return Promise.resolve(value).then(function (value) {
            return step("next", value);
          }, function (err) {
            return step("throw", err);
          });
        }
      }
      return step("next");
    });
  };
}

var router = require("express").Router();
var Url = require("../db/url-model");

var _require = require("express-validator");

var check = _require.check;
var validationResult = _require.validationResult;

var ObjectId = require("mongodb").ObjectId;
router.post("/", [check("type").not().isEmpty()], function () {
  var ref = _async_data_filter(regeneratorRuntime.mark(function _callee(req, res) {
    var errors, _req$body, lastname, type, child, fromwho, concerning, details, phone, ip, urlDefinition, urlModel;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            errors = validationResult(req);

            if (errors.isEmpty()) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", res.status(422).json({ errors: errors.array() }));

          case 3:
            _req$body = req.body;
            lastname = _req$body.lastname;
            type = _req$body.type;
            child = _req$body.child;
            fromwho = _req$body.fromwho;
            concerning = _req$body.concerning;
            details = _req$body.details;
            phone = _req$body.phone;
            ip = _req$body.ip;
            urlDefinition = {};

            urlDefinition.lastname = lastname;
            urlDefinition.type = type;
            urlDefinition.child = child;
            urlDefinition.fromwho = fromwho;
            urlDefinition.concerning = concerning;
            urlDefinition.details = details;
            urlDefinition.phone = phone;
            urlDefinition.ip = ip;

            urlModel = new Url(urlDefinition);

            console.log(urlModel);

            _context.next = 25;
            return urlModel.save(function (err) {
              if (err) {
                res.json("err");
              } else {
                res.json(urlModel);
              }
            });

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
}());

router.get("/get-all-document", function () {
  var ref = _async_data_filter(regeneratorRuntime.mark(function _callee2(req, res) {
    var filter, all;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            filter = {};
            _context2.next = 3;
            return Url.find(filter);

          case 3:
            all = _context2.sent;

            res.json(all);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x3, _x4) {
    return ref.apply(this, arguments);
  };
}());
router.post("/take-charge/:id", function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res) {
    var id, url;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _context3.next = 3;
            return Url.findOne({
              _id: ObjectId(id)
            });

          case 3:
            url = _context3.sent;

            if (!url) {
              _context3.next = 14;
              break;
            }

            _context3.next = 7;
            return Url.findOneAndUpdate({
              _id: ObjectId(id)
            }, {
              $set: {
                assigned: true,
                assigned_to: req.body.user
              }
            });

          case 7:
            url = _context3.sent;
            _context3.next = 10;
            return Url.findOne({
              _id: ObjectId(id)
            });

          case 10:
            url = _context3.sent;

            res.json({
              status: true,
              message: "Success!"
            });
            _context3.next = 15;
            break;

          case 14:
            res.json({
              status: false,
              message: "Report not found!"
            });

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x5, _x6) {
    return ref.apply(this, arguments);
  };
}());
router.post("/change-status/:id", function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(req, res) {
    var id, status, Statuses, url;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            status = req.body.status;
            Statuses = require("../db/status-model").Statuses;
            _context4.next = 5;
            return Url.findOne({
              _id: ObjectId(id)
            });

          case 5:
            url = _context4.sent;

            if (!url) {
              _context4.next = 16;
              break;
            }

            _context4.next = 9;
            return Url.findOneAndUpdate({
              _id: ObjectId(id)
            }, {
              $set: {
                status: Statuses[status]
              }
            });

          case 9:
            url = _context4.sent;
            _context4.next = 12;
            return Url.findOne({
              _id: ObjectId(id)
            });

          case 12:
            url = _context4.sent;

            res.json({
              status: true,
              message: "Status Changed!"
            });
            _context4.next = 17;
            break;

          case 16:
            res.json({
              status: false,
              message: "Report not found!"
            });

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x7, _x8) {
    return ref.apply(this, arguments);
  };
}());
router.get("/delete/:id", function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(req, res) {
    var id, url;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = req.params.id;
            _context5.next = 3;
            return Url.findOne({
              _id: ObjectId(id)
            });

          case 3:
            url = _context5.sent;

            if (!url) {
              _context5.next = 11;
              break;
            }

            _context5.next = 7;
            return Url.findOneAndDelete({
              _id: ObjectId(id)
            });

          case 7:
            url = _context5.sent;

            res.json({
              status: true,
              message: "Deleted"
            });
            _context5.next = 12;
            break;

          case 11:
            res.json({
              status: false,
              message: "Report not found!"
            });

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function (_x9, _x10) {
    return ref.apply(this, arguments);
  };
}());
module.exports = router;