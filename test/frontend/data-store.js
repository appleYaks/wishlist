// these tests assume that the DataStore sorts its model types' models by id
describe('DataStore', function () {
  describe('working with model types', function () {
    var store;

    beforeEach(function () {
      visit('/');
      clearDataStore();
      store = App.__container__.lookup('store:main');
    });

    afterEach(function () {
      store = null;
      App.reset();
    });

    it('adds a new type', function () {
      var type = 'testType';
      store.addType(type);
      expect(store.all.bind(store, type)).to.not.throw(Error);
      store.all(type).should.exist;
    });

    it('fails to get a non-existent type', function () {
      expect(store.all.bind(store, 'noExist')).to.throw(Error);
    });

    it('clears a type of its models', function () {
      var type = 'testType';
      store.addType(type);
      store.all(type).get('length').should.exist;
    });

    it('sorts a modelType container by a given key', function () {
      var type = 'testType';
      var key = 'sort';
      var modelType, sorted;
      var models = [{
        id: 1,
        sort: 10
      }, {
        id: 2,
        sort: 9
      }, {
        id: 3,
        sort: 8
      }, {
        id: 4,
        sort: 7
      }, {
        id: 5,
        sort: 6
      }];

      store.addType(type);
      store.load(type, models);

      modelType = store.all(type);
      modelType.get('length').should.equal(5);

      // returns a sorted array using a given modelType
      sorted = store._sortBy(modelType, key);
      expect(sorted.get('length')).to.equal(models.length);
      expect(sorted.mapBy('sort')).to.deep.equal([6,7,8,9,10]);

      // returns a sorted array using a given string
      sorted = store._sortBy(type, key);
      expect(sorted.get('length')).to.equal(models.length);
      expect(sorted.mapBy('sort')).to.deep.equal([6,7,8,9,10]);
    });
  });

  describe('adding elements', function () {
    var store;

    beforeEach(function () {
      visit('/');
      clearDataStore();
      store = App.__container__.lookup('store:main');
    });

    afterEach(function () {
      store = null;
      App.reset();
    });

    it('adds a new model', function () {
      var type = 'testType';
      var retrieved;
      var model = {
        id: 999,
        title: 'test title'
      };

      store.addType(type);
      store.load(type, model);
      store.all(type).get('length').should.equal(1);

      retrieved = store.all(type).get('firstObject');
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(model.id);
      retrieved.get('title').should.equal(model.title);
    });

    it('adds a new model wrapped in an array', function () {
      var type = 'testType';
      var retrieved;
      var model = [{
        id: 999,
        title: 'test title'
      }];

      store.addType(type);
      store.load(type, model);
      store.all(type).get('length').should.equal(1);

      retrieved = store.all(type).get('firstObject');
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(model[0].id);
      retrieved.get('title').should.equal(model[0].title);
    });

    it('adds a new model when the DataStore is not empty', function () {
      var type = 'testType';
      var retrieved;
      var fill = {
        id: 123,
        title: 'test title 1'
      };
      var model = {
        id: 999,
        title: 'test title 2'
      };

      store.addType(type);
      store.load(type, fill);
      store.all(type).get('length').should.equal(1);

      store.load(type, model);
      store.all(type).get('length').should.equal(2);

      retrieved = store.all(type).objectAt(0);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(fill.id);
      retrieved.get('title').should.equal(fill.title);

      retrieved = store.all(type).objectAt(1);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(model.id);
      retrieved.get('title').should.equal(model.title);
    });

    it('adds a new model wrapped in an array when the DataStore is not empty', function () {
      var type = 'testType';
      var retrieved;
      var fill = {
        id: 123,
        title: 'test title 1'
      };
      var model = [{
        id: 999,
        title: 'test title 2'
      }];

      store.addType(type);
      store.load(type, fill);
      store.all(type).get('length').should.equal(1);

      store.load(type, model);
      store.all(type).get('length').should.equal(2);

      retrieved = store.all(type).objectAt(0);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(fill.id);
      retrieved.get('title').should.equal(fill.title);

      retrieved = store.all(type).objectAt(1);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(model[0].id);
      retrieved.get('title').should.equal(model[0].title);
    });

    it('adds multiple models', function () {
      var type = 'testType';
      var retrieved;
      var models = [{
        id: 123,
        title: 'test title 1'
      }, {
        id: 999,
        title: 'test title 2'
      }];

      store.addType(type);
      store.load(type, models);
      store.all(type).get('length').should.equal(2);

      retrieved = store.all(type).objectAt(0);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(models[0].id);
      retrieved.get('title').should.equal(models[0].title);

      retrieved = store.all(type).objectAt(1);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(models[1].id);
      retrieved.get('title').should.equal(models[1].title);
    });

    it('adds multiple models when the DataStore is not empty', function () {
      var type = 'testType';
      var retrieved;
      var fill = {
        id: 456,
        title: 'test title 1'
      };
      var models = [{
        id: 123,
        title: 'test title 1'
      }, {
        id: 999,
        title: 'test title 2'
      }];

      store.addType(type);
      store.load(type, fill);
      store.all(type).get('length').should.equal(1);

      store.load(type, models);
      store.all(type).get('length').should.equal(3);

      retrieved = store.all(type).objectAt(0);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(models[0].id);
      retrieved.get('title').should.equal(models[0].title);

      retrieved = store.all(type).objectAt(1);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(fill.id);
      retrieved.get('title').should.equal(fill.title);

      retrieved = store.all(type).objectAt(2);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(models[1].id);
      retrieved.get('title').should.equal(models[1].title);
    });

    it('does nothing with an empty array', function () {
      var type = 'testType';
      store.addType(type);
      store.load(type, []);
      store.all(type).get('length').should.equal(0);
    });

    it('merges objects when asked', function () {
      var type = 'testType';
      var retrieved;
      var fill = {
        id: 1,
        title: 'title 1',
        myAttr: 'old'
      };
      var duplicate = {
        id: 1,
        title: 'new title',
        myAttr: 'new',
        newAttr: 'i am new here!'
      };

      store.addType(type);
      store.load(type, fill);
      store.all(type).get('length').should.equal(1);

      retrieved = store.all(type).objectAt(0);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(fill.id);
      retrieved.get('title').should.equal(fill.title);
      retrieved.get('myAttr').should.equal(fill.myAttr);
      expect(retrieved.get('newAttr')).to.not.exist;

      store.load(type, duplicate);
      store.all(type).get('length').should.equal(1);

      retrieved = store.all(type).objectAt(0);
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(duplicate.id);
      retrieved.get('title').should.equal(duplicate.title);
      retrieved.get('myAttr').should.equal(duplicate.myAttr);
      retrieved.get('newAttr').should.equal(duplicate.newAttr);
    });

    it('sorts objects based on an arbitrary key', function () {
      var type = 'testType';
      var modelType;
      var models = [{
        id: 1,
        sort: 10
      }, {
        id: 2,
        sort: 9
      }, {
        id: 3,
        sort: 8
      }, {
        id: 4,
        sort: 7
      }, {
        id: 5,
        sort: 6
      }];

      function mapFunction (item) {
        return [item.get('id'), item.get('sort')];
      }

      store.addType(type);
      store.load(type, models);
      store.all(type).get('length').should.equal(5);

      modelType = store.all(type);
      modelType.map(mapFunction).should.deep.equal([[1,10], [2,9], [3,8], [4,7], [5,6]]);
      store._sortBy(type, 'sort').map(mapFunction).should.deep.equal([[5,6], [4,7], [3, 8], [2, 9], [1,10]]);
    });
  });

  describe('searching for models', function () {
    var store;

    beforeEach(function () {
      visit('/');
      clearDataStore();
      store = App.__container__.lookup('store:main');
    });

    afterEach(function () {
      store = null;
      App.reset();
    });

    it('searches for items using binary search', function () {
      var type = 'testType';
      var modelType, find, bSearch, field, i;
      var models = [{
        id: 1,
        sort: 10
      }, {
        id: 2,
        sort: 9
      }, {
        id: 3,
        sort: 8
      }, {
        id: 4,
        sort: 7
      }, {
        id: 5,
        sort: 6
      }];

      store.addType(type);
      store.load(type, models);

      modelType = store.all(type);
      modelType.get('length').should.equal(models.length);

      // searching by `id`
      for (i = 1; i < 6; ++i) {
        find = modelType.findBy('id', field);
        bSearch = store._binarySearch(modelType, field);
        expect(find).to.equal(bSearch);
      }

      expect(store._binarySearch(modelType, 0)).to.not.exist;
      expect(store._binarySearch(modelType, 6)).to.not.exist;

      // searching by `sort`
      modelType = modelType.sortBy('sort');

      for (i = 6; i < 11; ++i) {
        find = modelType.findBy('sort', field);
        bSearch = store._binarySearch(modelType, field);
        expect(find).to.equal(bSearch);
      }

      expect(store._binarySearch(modelType, 5)).to.not.exist;
      expect(store._binarySearch(modelType, 11)).to.not.exist;
    });

    it('returns a single model using search criteria', function () {
      var type = 'testType';
      var modelType, find;
      var spy;
      var models = [{
        id: 1,
        sort: 10
      }, {
        id: 2,
        sort: 9
      }, {
        id: 3,
        sort: 8
      }, {
        id: 4,
        sort: 7
      }, {
        id: 5,
        sort: 6
      }, {
        id: 6,
        sort: 6
      }];

      store.addType(type);
      store.load(type, models);

      spy = sinon.spy(store, '_binarySearch');

      // returns a model with a given id
      find = store.find(type, models[0].id);
      expect(find).to.exist;
      expect(find.get('id')).to.equal(models[0].id);

      // returns undefined when given a non-existent id
      find = store.find(type, 999);
      expect(find).to.not.exist;

      spy.should.have.been.calledTwice;
      store._binarySearch.restore();

      // returns a model by a given key
      find = store.find(type, 'sort', models[models.length-1].sort);
      expect(find).to.exist;
      // models.length-2 should be the first result returned
      expect(find.get('id')).to.equal(models[models.length-2].id);
      expect(find.get('sort')).to.equal(models[models.length-2].sort);

      // returns undefined when given a non-existent key
      find = store.find(type, 'noExist', 999);
      expect(find).to.not.exist;

      // returns undefined when given an id that doesn't convert to a number
      find = store.find(type, 'abcxyz');
      expect(find).to.not.exist;
    });

    it('returns all models using search criteria', function () {
      var type = 'testType';
      var modelType, find;
      var models = [{
        id: 1,
        sort: 10
      }, {
        id: 2,
        sort: 9
      }, {
        id: 3,
        sort: 8
      }, {
        id: 4,
        sort: 7
      }, {
        id: 5,
        sort: 6
      }, {
        id: 6,
        sort: 6
      }];

      store.addType(type);
      store.load(type, models);

      modelType = store._store.get(type);
      modelType.get('length').should.equal(models.length);

      // returns the modelType itself
      find = store.all(type);
      expect(find).to.equal(modelType);

      // returns all models with a given id
      find = store.all(type, models[0].id);
      expect(find).to.have.length(1);
      expect(find.get('firstObject').get('id')).to.equal(models[0].id);

      // returns all models by a given key
      find = store.all(type, 'sort', models[models.length-1].sort);
      expect(find).to.have.length(2);
      expect(find.objectAt(0).get('sort')).to.equal(models[models.length-1].sort);
      expect(find.objectAt(1).get('sort')).to.equal(models[models.length-1].sort);

      // returns an empty array when given a non-existent key
      find = store.all(type, 'noExist', 999);
      expect(find).to.be.empty;

      // returns an empty array when given an id that doesn't convert to a number
      find = store.all(type, 'abcxyz');
      expect(find).to.be.empty;
    });
  });
});
