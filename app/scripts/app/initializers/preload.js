export default {
    name: 'preloadData',
    after: ['data-store'],

    initialize: function (container, application) {
      var store = container.lookup('store:main');
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
        attributes.forEach(function (obj) {
          var data = JSON.parse(obj.content);

          if (obj.target === 'route:groups') {
            store.load('groups', data);
          }

          container.lookup(obj.target).set('preload', true);

          // this would be useful for sending the data to the route
          // application.register('preload:groups', data, { instantiate: false });
          // application.inject(obj.target, 'preloadData', 'preload:groups');
        });
      }
    }
  };
