var ApplicationView = Em.View.extend({
  eventManager: {
    doubleClick: function (e, view) {
      console.log('*** ApplicationView Event: double-click event on view: ', view, ', Event: ', e);
    },
  },
});

export default ApplicationView;
