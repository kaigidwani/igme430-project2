const models = require('../models');

const { Character } = models;

const makerPage = async (req, res) => res.render('app');

const makeCharacter = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required! ' });
  }

  const characterData = {
    name: req.body.name,
    age: req.body.age,
    face: req.body.face,
    skinColor: req.body.skinColor,
    hair: req.body.hair,
    top: req.body.top,
    bottoms: req.body.bottoms,
    owner: req.session.account._id,
  };

  try {
    const newCharacter = new Character(characterData);
    await newCharacter.save();
    return res.status(201).json({ 
      name: newCharacter.name, 
      age: newCharacter.age, 
      face: newCharacter.face,
      skinColor: newCharacter.skinColor,
      hair: newCharacter.hair,
      top: newCharacter.top,
      bottoms: newCharacter.bottoms 
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This character already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making the character! ' });
  }
};

const getCharacters = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Character.find(query).select('name age face skinColor hair top bottoms').lean().exec();

    return res.json({ characters: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving characters!' });
  }
};

module.exports = {
  makerPage,
  makeCharacter,
  getCharacters,
};
