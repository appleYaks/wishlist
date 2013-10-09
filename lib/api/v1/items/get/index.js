'use strict';

// placeholder for app instance
var app;
exports.use = function (appInstance) {
  app = appInstance;
};

exports.all = function (req, res, next) {
  if (req.query.ids) {
    var ids = req.query.ids;
    var result = [];

    // n^2 time, improve it later
    items.forEach(function (item) {
      if (ids.indexOf(''+item.id) > -1) result.push(item);
    });

    return res.send({
      item: result
    });
  }

  if (req.query.group) {
    var group = +req.query.group;
    var result = [];
    items.forEach(function (item) {
      if (item.group === group) result.push(item);
    });

    return res.send({
      item: result
    });
  }

  return res.send({
    item: items
  });
};

exports.itemById = function (req, res) {
  var itemId = +req.params.item_id;
  var itemList = [];

  // push only the first item to pass
  items.some(function (item) {
    if (item.id === itemId) {
      itemList.push(item);
      return true;
    }
  });

  return res.send({
    item: itemList
  });
};

exports.itemsByGroup = function (req, res) {
  var groupId = +req.params.group_id;
  var result = [];

  items.forEach(function (item) {
    if (item.group_id === groupId) {
      result.push(item);
    }
  });

  return res.send({
    item: result
  });
};
