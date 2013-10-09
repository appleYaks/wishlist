'use strict';

var app, db;
exports.use = function (appInstance) {
  app = appInstance;
  db  = appInstance.db;
};
