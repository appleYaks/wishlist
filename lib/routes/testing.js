var app;

var serveIndex = function () {
  app.get('/test', function (req, res) {
    res.render('test');
  });
};

var serveMocha = function () {
  app.get('/mocha.js', function (req, res) {
    res.sendFile(app.root + '/bower_components/mocha/mocha.js');
  });
  app.get('/mocha.css', function (req, res) {
    res.sendFile(app.root + '/bower_components/mocha/mocha.css');
  });
  app.get('/ember-mocha-adapter.js', function (req, res) {
    res.sendFile(app.root + '/bower_components/ember-mocha-adapter/adapter.js');
  });
  app.get('/chai.js', function (req, res) {
    res.sendFile(app.root + '/bower_components/chai/chai.js');
  });
  app.get('/tests.js', function (req, res) {
    res.sendFile(app.root + '/.tmp/scripts/tests.js');
  });
};

var init = function (appInstance) {
  app = appInstance;

  serveIndex();
  serveMocha();
};

module.exports = {
  init: init
};
