var IndexRoute = Em.Route.extend({
  beforeModel: function () {
    this.replaceWith('groups');
  },
});

export default IndexRoute;
