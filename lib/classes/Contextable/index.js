'use strict';

var Contextable = {};
Contextable.create = function () {
  var self = {};
  var args = [].slice.apply(arguments);

  args.forEach(function (arg) {
    recurse(self, arg);
  });

  function recurse (ctx, obj) {
    var prop;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        prop = obj[key];

        if (typeof prop === 'function') {
          ctx[key] = prop.bind(self);
        } else if (typeof prop === 'object' && !prop.length) {
          ctx[key] = recurse({}, prop);
        } else {
          ctx[key] = obj[key];
        }
      }
    }

    return ctx;
  }

  return self;
};

module.exports = Contextable;
