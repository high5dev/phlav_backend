"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var Statuses = require("./status-model").Statuses;

var urlSchema = new Schema({
  lastname: {
    type: String
  },
  type: {
    type: String,
    required: true
  },
  child: {
    type: String,
    required: true
  },
  fromwho: {
    type: String,
    required: true
  },
  concerning: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  phone: {
    type: String
  },
  ip: {
    type: String
  },
  status: {
    type: Object,
    default: Statuses.disponible
  },
  assigned: {
    type: Boolean,
    default: false
  },
  assigned_to: {
    type: Object
  }
});
var Url = mongoose.model("type", urlSchema);
module.exports = Url;
