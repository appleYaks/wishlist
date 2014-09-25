var st = require('st');
var app;

var init = function (appInstance) {
    app = appInstance;

    serveStatic();
    serveFonts();
};

var serveStatic = function () {
  // host dev files if in dev mode
  if (/^development|test$/.test(app.get('env'))) {
    app.use(st({
      path: app.root + '/.tmp',
      url: '/',
      dot: true,
      cache: false,
      passthrough: true
    }));
    app.use(st({
      path: app.root + '/app/styles',
      url: '/app/styles',
      cache: false,
    }));
    app.use(st({
      path: app.root + '/app/images',
      url: '/images',
      cache: false,
    }));
  } else if (app.get('env') === 'production') {
    app.use(st({
      path: app.root + '/dist/app'
    }));
  }
};

var serveFonts = function () {
  app.use(st({
    path: app.root + '/bower_components/font-awesome/fonts',
    url: '/fonts',
  }));
};

module.exports = {
    init: init,
};
