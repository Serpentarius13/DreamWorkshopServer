module.exports = {
  newDream: async (parent, args, { models }) => {
    let { name, email, time, dreamName, description } = args;

    if (!name) name = null;
    if (!email) email = null;
    if (!time) time = null;

    const doc = await models.Dream.create({
      name,
      email,
      time,
      dreamName,
      description,
    });
    console.log(doc);

    return doc;
  },
};
