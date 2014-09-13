import DataStore from 'client/utils/data-store';

export default {
    name: 'datastore',

    initialize: function (container, application) {
      application.register('store:main', DataStore);
      application.inject('route', 'store', 'store:main');
    }
};
