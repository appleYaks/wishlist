var when = require('when');

var createGroups = function (Group) {
  return when.promise(function (resolve) {
    Group.bulkCreate([
      { title: 'group1', order: 0, date: Date.now(), fields: '[]' },
      { title: 'group2', order: 1, date: Date.now(), fields: '[]' },
      { title: 'group3', order: 2, date: Date.now(), fields: '[]' },
      { title: 'group4', order: 3, date: Date.now(), fields: '[]' },
    ]).success(function () {
      Group.findAll().success(function (groups) {
        console.log('groups are', groups);
        var groupIds = groups.map(function (group) {
          return group.values.id;
        });

        resolve(groupIds);
      });
    });
  });
};

var seed = function (sequelize, db) {
  console.log('seeding');
  var Group = db.Group;

  return createGroups(Group).then(function (groupIds) {
    console.log(groupIds);
  });
};

module.exports = seed;
