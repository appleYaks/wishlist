var when = require('when');

var createGroups = function (Group) {
  return when.promise(function (resolve) {
    Group.bulkCreate([
      { title: 'group1', description: 'Group 1 babeh!', date: Date.now(), fields: '[]' },
      { title: 'group2', description: 'Group 2 babeh!', date: Date.now(), fields: '[]' },
      { title: 'group3', description: 'Group 3 babeh!', date: Date.now(), fields: '[]' },
      { title: 'group4', description: 'Group 4 babeh!', date: Date.now(), fields: '[]' },
    ]).success(function () {
      Group.findAll().success(resolve);
    });
  });
};

var createItem = function (Item, itemNumber, group) {
  return when.promise(function (resolve) {
    var item = {
      title:     'item ' + itemNumber + ' on group ' + group.values.id,
      description: 'This is item ' + itemNumber + ' on group ' + group.values.id,
      rating:    Math.floor(Math.random() * 5),
      date:      Date.now(),
      priority:  Math.floor(Math.random() * 3),
      complete:  false,
      fields:    '[]'
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
    var totalItems = 4;

    while (currentItem < totalItems) {
      batchItems.push(createItem(Item, currentItem, group));
      currentItem++;
    }

    return when.all(batchItems);
  });

  return when.all(promises);
};

var seed = function (sequelize, app, db) {
  var Group = db.Group;
  var Item = db.Item;

  if (!app.seed) {
    return when.resolve();
  }

  return createGroups(Group)
    .then(createItems.bind(null, Item));
};

module.exports = seed;
