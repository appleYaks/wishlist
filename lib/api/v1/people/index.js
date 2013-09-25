'use strict';

// placeholder for app instance
var app;
exports.use = function (appInstance) {
  app = appInstance;
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
