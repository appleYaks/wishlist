var body = document.body;

var ApplicationRoute = Em.Route.extend({
  spinnerEl: 'div',
  spinnerClassNames: 'loading fa fa-spin fa-spinner',

  removeLoadingSpinner: function () {
    var spinnerClassNames = this.get('spinnerClassNames'),
        spinnerEl = this.get('spinnerEl'),
        spinners = [].slice.call(body.children).filter(function (el) {
          return el.className === spinnerClassNames && el.nodeName.toLowerCase() === spinnerEl;
        });

    spinners.forEach(function (spinner) {
      body.removeChild(spinner);
    });
  },

  actions: {
    loading: function () {
      var spinnerEl = this.get('spinnerEl'),
          spinner = document.createElement(spinnerEl);

      spinner.className = this.get('spinnerClassNames');
      body.appendChild(spinner);
      this.router.on('didTransition', this, 'removeLoadingSpinner');
    }
  }
});

export default ApplicationRoute;
