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

let router = require("express").Router();
const Url = require("../db/url-model");
const { check, validationResult } = require("express-validator");
const ObjectId = require("mongodb").ObjectId;

router.post(
  "/",
  [check("type").not().isEmpty()],
  (() => {
    var ref = _async_data_filter(function* (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

      const {
        lastname,
        type,
        child,
        fromwho,
        concerning,
        details,
        phone,
        ip,
      } = req.body;

      let urlDefinition = {};
      urlDefinition.lastname = lastname;
      urlDefinition.type = type;
      urlDefinition.child = child;
      urlDefinition.fromwho = fromwho;
      urlDefinition.concerning = concerning;
      urlDefinition.details = details;
      urlDefinition.phone = phone;
      urlDefinition.ip = ip;

      let urlModel = new Url(urlDefinition);
      console.log(urlModel);

      yield urlModel.save(function (err) {
        if (err) {
          res.json("err");
        } else {
          res.json(urlModel);
        }
      });
    });

    return function (_x, _x2) {
      return ref.apply(this, arguments);
    };
  })()
);

router.get(
  "/get-all-document",
  (() => {
    var ref = _async_data_filter(function* (req, res) {
      const filter = {};
      const all = yield Url.find(filter);
      res.json(all);
    });

    return function (_x3, _x4) {
      return ref.apply(this, arguments);
    };
  })()
);
router.post("/take-charge/:id", async (req, res) => {
  const id = req.params.id;

  var url = await Url.findOne({
    _id: ObjectId(id),
  });
  if (url) {
    url = await Url.findOneAndUpdate(
      {
        _id: ObjectId(id),
      },
      {
        $set: {
          assigned: true,
          assigned_to: req.body.user,
        },
      }
    );
    url = await Url.findOne({
      _id: ObjectId(id),
    });
    res.json({
      status: true,
      message: "Success!",
    });
  } else {
    res.json({
      status: false,
      message: "Report not found!",
    });
  }
});

router.post("/change-status/:id", async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  const Statuses = require("../db/status-model").Statuses;
  var url = await Url.findOne({
    _id: ObjectId(id),
  });
  if (url) {
    url = await Url.findOneAndUpdate(
      {
        _id: ObjectId(id),
      },
      {
        $set: {
          status: Statuses[status],
        },
      }
    );
    url = await Url.findOne({
      _id: ObjectId(id),
    });
    res.json({
      status: true,
      message: "Status Changed!",
    });
  } else {
    res.json({
      status: false,
      message: "Report not found!",
    });
  }
});

router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  var url = await Url.findOne({
    _id: ObjectId(id),
  });
  if (url) {
    url = await Url.findOneAndDelete({
      _id: ObjectId(id),
    });
    res.json({
      status: true,
      message: "Deleted",
    });
  } else {
    res.json({
      status: false,
      message: "Report not found!",
    });
  }
});

module.exports = router;
