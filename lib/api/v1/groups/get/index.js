'use strict';

var app, db;
exports.use = function (appInstance) {
  app = appInstance;
  db  = appInstance.db;
};

exports.all = function (req, res, next) {
  db.groups.read.all(function (err, groups) {
    if (err) {
      return next(err);
    }

    res.send({
      group: groups
    });
  });
};

exports.groupById = function (req, res) {
  var groupId = +req.params.group_id;
  var groupList = [];
  var itemList = [];

  // push only the first item to pass
  groups.some(function (group) {
    if (group.id === groupId) {
      groupList.push(group);
      return true;
    }
  });

  items.forEach(function (item) {
    if (item.group_id === groupId) {
      itemList.push(item);
    }
  });

  return res.send({
    group: groupList,
    item: itemList
  });
};
