import DataStore from 'client/utils/data-store';
import GroupModel from 'client/models/group';
import ItemModel from 'client/models/item';

export default {
    name: 'data-store',

    initialize: function (container, application) {
      var store;

      // warnings clutter the console in testing
      if (!application.get('testing')) {
          DataStore.reopen({ warnings: true });
      }

      application.register('store:main', DataStore);
      application.inject('route', 'store', 'store:main');
      application.inject('controller', 'store', 'store:main');

      // add basic model types to the store so they can accept models
      store = container.lookup('store:main');
      store.addType('groups');
      store.registerModelFactory('groups', GroupModel);
      store.addType('items');
      store.registerModelFactory('items', ItemModel);
    }
};
