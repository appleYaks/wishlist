'use strict';

// placeholder for app instance
var app;
exports.use = function (appInstance) {
  app = appInstance;
};

var groups = [
  {
    id: 0,
    name: 'group0',
    items: [0,1]
  },
  {
    id: 1,
    name: 'group1',
    items: [2,3]
  },
];

var items = [
  {
    id: 0,
    name: 'item0',
    group_id: 0
  },
  {
    id: 1,
    name: 'item1',
    group_id: 0
  },
  {
    id: 2,
    name: 'item2',
    group_id: 1
  },
  {
    id: 3,
    name: 'item3',
    group_id: 1
  },
];

exports.all = function (req, res, next) {
  res.send({
    group: groups
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

exports.itemsAll = function (req, res, next) {
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

// even though this method looks unnecessary since
// it's somewhat wrapping the database method,
// we might need to do something else with the data here,
// or even send a different response depending on
// other factors, such as whether the request was an XHR
exports.getAll = function (req, res, next) {
  // used when client starts at /person/:name and
  // only has the name to go on for a data request
  if (req.query.name) {
    return app.db.getPeopleByName(req.query.name, function (err, people) {
      if (err) {
        return next(err);
      }

      // this is the format Ember.js expects
      // http://emberjs.com/guides/models/connecting-to-an-http-server/#toc_json-conventions
      res.send({
        people: people
      });
    });
  }

  app.db.getPeople(function (err, person) {
    if (err) {
      return next(err);
    }

    // this is the format Ember.js expects
    // http://emberjs.com/guides/models/connecting-to-an-http-server/#toc_json-conventions
    res.send({
      people: person
    });
  });
};

// demonstrating what effect an error would produce
exports.getError = function (req, res, next) {
  app.db.getError(function (err) {
    return next(err);
  });
};
