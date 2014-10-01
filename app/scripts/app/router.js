var Router = Em.Router.extend({
  location: 'history'
});

Router.map(function () {
  this.resource('groups', {path: '/groups'}, function () {
    // these inner resources 'group' and 'items' are split up
    // so that their inner views are exclusively shown on screen.
    // also for clarity.

    this.resource('group', {path: ':group_id'}, function () {
      this.route('edit');
    });

    this.resource('items', {path: ':group_id/items'}, function () {
      this.resource('item', {path: ':item_id'}, function () {
        this.route('edit');
      });
      this.route('new');
    });
  });
});

export default Router;

