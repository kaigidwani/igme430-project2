const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
const setFace = (face) => _.escape(face).trim();
const setSkinColor = (skinColor) => _.escape(skinColor).trim();
const setHair = (hair) => _.escape(hair).trim();
const setTop = (top) => _.escape(top).trim();
const setbottoms = (bottoms) => _.escape(bottoms).trim();

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  face: {
    type: String,
    required: true,
    set: setFace,
  },
  skinColor: {
    type: String,
    required: true,
    set: setSkinColor,
  },
  hair: {
    type: String,
    required: true,
    set: setHair,
  },
  top: {
    type: String,
    required: true,
    set: setTop,
  },
  bottoms: {
    type: String,
    required: true,
    set: setbottoms,
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

CharacterSchema.static.toAPI = (doc) => ({
  name: doc.name,
  face: doc.face,
  skinColor: doc.skinColor,
  hair: doc.hair,
  top: doc.top,
  bottoms: doc.bottoms,
});

const CharacterModel = mongoose.model('Character', CharacterSchema);
module.exports = CharacterModel;
