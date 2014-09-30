export default {
    name: 'preloadData',
    after: ['data-store'],

    initialize: function (container, application) {
      var store = container.lookup('store:main');
      var head = document.head;

      var attributes = [
        {
          target: 'route:groups',
          type: 'groups',
          content: $('meta[name="preload-groups"]', head).attr('content')
        },
        {
          type: 'items',
          content: $('meta[name="preload-items"]', head).attr('content')
        }
      ].filterBy('content');

      var hasData = !Em.isEmpty(attributes);

      if (hasData) {
        attributes.forEach(function (obj) {
          var data = JSON.parse(obj.content);

          if (!data) {
            return;
          }

          if (obj.type) {
            store.load(obj.type, data);
          }

          if (obj.target) {
            container.lookup(obj.target).set('preload', true);
          }
        });
      }
    }
  };
