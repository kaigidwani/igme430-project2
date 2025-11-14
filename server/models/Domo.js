const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const setFace = (face) => _.escape(face).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  face: {
    type: String,
    required: true,
    set: setFace,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.static.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  face: doc.face,
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
