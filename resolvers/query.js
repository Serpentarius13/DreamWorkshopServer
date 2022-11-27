const casual = require("casual");

module.exports = {
  getAll: async (parent, args, { models }) => {
    const allDreams = await models.Dream.find();
    return allDreams;
  },

  getOneDream: async (parent, { id }, { models }) => {
    const dream = await models.Dream.findOne({ _id: id });

    console.log(dream);

    return dream;
  },

  sentence: () => {
    return casual.sentence;
  }
};
