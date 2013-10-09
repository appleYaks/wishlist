'use strict';

function Extendable () {}
Extendable.prototype.extend = function () {
  var args = [].slice.apply(arguments);
  var self = this;

  function recurse (obj) {
    var o = {};
    var prop;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        prop = obj[key];

        if (typeof prop === 'function') {
          o[key] = function () { return prop.apply(self, arguments) };
        } else if (typeof prop === 'object') {
          o[key] = recurse(prop);
        } else {
          o[key] = obj[key];
        }
      }
    }

    return o;
  }

  args.forEach(function (arg) {
    var props = recurse(arg);

    for (var key in props) {
      if (props.hasOwnProperty(key)) {
        self[key] = props[key];
      }
    }
  });
};

module.exports = Extendable;
