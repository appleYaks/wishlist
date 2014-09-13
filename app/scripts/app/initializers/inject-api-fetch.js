import Api from 'client/utils/api-fetch';
import sequelizeTransform from 'client/utils/sequelize-data-transform';

export default {
  name: 'api-fetch',
  after: ['data-store'],

  initialize: function (container, application) {
      application.register('api:main', Api);
      application.inject('api:main', 'store', 'store:main');
      application.inject('route', 'api', 'api:main');

      var api;
      api = container.lookup('api:main');
      api.set('keyTransforms.defalt', sequelizeTransform);
  }
};
