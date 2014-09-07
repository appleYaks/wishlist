var IndexRoute = Em.Route.extend({
  beforeModel: function () {
    this.transitionTo('groups');
  },
});

export default IndexRoute;
