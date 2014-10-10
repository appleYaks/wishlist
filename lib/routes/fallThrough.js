var app;

var init = function (appInstance) {
    app = appInstance;

    setup404();
    setup500();
};

var setup404 = function () {
  app.use(function(req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
  });
};

var setup500 = function () {
  app.use(function(err, req, res, next) {
    // give priority to a custom res.statusCode over err.status when a server error occurs
    if (res.statusCode === 200) {
      err.status = err.status || (err.status = 500);
      res.status(err.status);
    }

    console.error('Server error catch-all says: ', err);

    // prevent users from seeing specific error messages in production
    if (app.get('env') !== 'development') {
      var newErr = new Error('Something went wrong. Sorry!');
      newErr.status = err.status;
      err = newErr;
    }

    // respond depending on highest-quality accepted format
    res.format({
      json: function () {
        res.send({
          data: err,
          message: err.message
        });
      },

      html: function () {
        res.render('errors', {
          data: err,
          message: err.message
        });
      },

      text: function () {
        res.send('Error ' + err.status);
      }
    });
  });
};

module.exports = {
    init: init,
};
