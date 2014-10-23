var Promise = require('bluebird');

var createGroups = function (Group) {
  return new Promise(function (resolve) {
    Group.bulkCreate([
      { title: 'movies', description: 'Movies I want!', date: Date.now(), fields: [] },
      { title: 'music',  description: 'Music I want!',  date: Date.now(), fields: [] },
      { title: 'games',  description: 'Games I want!',  date: Date.now(), fields: [] },
      { title: 'books',  description: 'Books I want!',  date: Date.now(), fields: [] },
    ]).success(function () {
      Group.findAll().success(resolve);
    });
  });
};

var getItemUniqueInfo = function (groupId, itemNumber) {
  var matrix = [
    [{ title: 'Reservoir Dogs', description: 'Tip your waitress.' }, { title: 'Kung Fu Panda', description: 'Skadoosh.'}, { title: 'The Notebook', description: 'Just trollin\', though I actually do want to see it.'}],
    [{ title: 'Buena Vista Social Club - Chan Chan', description: 'Hypnotic.', fields: [{ type: 'String', key: 'song', val: 'https://www.youtube.com/watch?v=tnFfKbxIHD0' }, { type: 'String', key: 'live-performance', val: 'https://www.youtube.com/watch?v=6JEdf7XsV5g'}]}, { title: 'Jimi Hendrix - All Along the Watchtower', description: 'Let\'s stop talkin\' falsely, now.' }, { title: 'Curtis Mayfield - Move on Up', description: 'Just move on up!', fields: [{ type: 'String', key: 'song', val: 'https://www.youtube.com/watch?v=6Z66wVo7uNw'}] }],
    [{ title: 'Amnesia - The Dark Descent', description: 'I must be a masochist.'}, { title: 'Kerbal Space Program', description: 'Gotta try this out one day if I get the gear.' }, { title: 'Fallout: New Vegas', description: 'Fallout 3 combined Jazz and the apocalypse. This can\'t possibly be a bad game, right?' }],
    [{ title: 'The Tale of Genji', description: 'S\'posed to be epic.' }, { title: 'Love and Math: The Heart of Hidden Reality', description: 'Math is the language of the universe.' }, { title: 'Mindfulness in Plain English', description: 'Transformative.', fields: [{ type: 'String', key: 'info', val: 'Available online for free, but the book is probably worth buying. http://www.urbandharma.org/udharma4/mpe.html'}] }]
  ];

  // ids start at 1
  return matrix[groupId-1][itemNumber-1];
};

var createItem = function (Item, itemNumber, group) {
  return new Promise(function (resolve) {
    var uniqueInfo = getItemUniqueInfo(group.values.id, itemNumber),
        item = {
          title:       uniqueInfo.title,
          description: uniqueInfo.description,
          rating:      Math.floor(4 + Math.random() * 2),
          date:        Date.now(),
          priority:    Math.floor(Math.random() * 5),
          complete:    false,
          fields:      uniqueInfo.fields || []
        };

    Item.create(item).success(function (item) {
      item.setGroup(group).success(function () {
        resolve();
      });
    });
  });
};

var createItems = function (Item, groups) {
  var promises = groups.map(function (group) {
    var batchItems = [];
    var currentItem = 1;
    var totalItems = 3;

    while (currentItem <= totalItems) {
      batchItems.push(createItem(Item, currentItem, group));
      currentItem++;
    }

    return Promise.all(batchItems);
  });

  return Promise.all(promises);
};

var seed = function (sequelize, app, db) {
  var Group = db.Group;
  var Item = db.Item;

  if (!app.seed) {
    return Promise.resolve();
  }

  return createGroups(Group)
    .then(createItems.bind(null, Item));
};

module.exports = seed;
