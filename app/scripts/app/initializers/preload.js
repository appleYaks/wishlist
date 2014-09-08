export default {
    name: 'preloadData',

    initialize: function (container, application) {
      var head = document.head;

      var attributes = [
        {
          target: 'route:groups',
          type: 'group',
          content: $('meta[name="preload-groups"]', head).attr('content')
        }
      ].filterBy('content');

      var hasData = !Em.isEmpty(attributes);

      if (hasData) {
        var store = container.lookup('store:main');

        attributes.forEach(function (obj) {
          var data = JSON.parse(obj.content);

          container.lookup(obj.target).set('preload', data);

          // this would be useful for sending the data to the route
          // application.register('preload:groups', data, { instantiate: false });
          // application.inject(obj.target, 'preloadData', 'preload:groups');
        });
      }
    }
  };
