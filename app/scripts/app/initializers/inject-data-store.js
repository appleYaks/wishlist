import DataStore from 'client/utils/data-store';

export default {
    name: 'data-store',

    initialize: function (container, application) {
      var store;

      application.register('store:main', DataStore);
      application.inject('route', 'store', 'store:main');

      // add basic model types to the store so they can accept models
      store = container.lookup('store:main');
      store.addType('groups');
      store.addType('items');
      window.s = store;
    }
};
