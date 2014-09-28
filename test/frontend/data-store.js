// this will test certain functions that are assumed to work in following test categories
describe('DataStore Prelim Tests', function () {
  var store;

  beforeEach(function () {
    store = require('client/utils/data-store')['default'].create();
  });

  it('has the private variable, _store', function () {
    expect(store.get('_store')).to.exist;
  });

  it('adds a datatype to the store', function () {
    var type = 'testType';
    expect(store.get('_store.' + type)).to.not.exist;
    expect(store.addType).to.be.a('function');
    store.addType(type);
    expect(store.get('_store.' + type)).to.exist;
  });
});

// these tests assume that the DataStore sorts its model types' models by id
describe('DataStore', function () {
  var store;
  var type = 'testType';
  var modelType;

  before(function () {
    // this way we bypass having to setup and teardown an Ember.Application,
    // and we avoid doing an `App.__container__.lookup()` which would prevent us
    // from then tearing down the application later.
    store = require('client/utils/data-store')['default'].create();

    // assumes addType works and _store exists, but the speedup of
    // not having to create and destroy new DataStores to check is
    // seriously worth this assumption.
    store.addType(type);
    modelType = store._store.get(type);
  });

  after(function () {
    modelType = null;
    store.clear();
    store = null;
  });

  describe('working with model types', function () {
    beforeEach(function () {
      store.clear();
    });

    it('adds a new type', function () {
      var type = 'testType2';
      store.addType(type);
      expect(store._store.get(type)).to.exist;
      expect(store.all.bind(store, type)).to.not.throw(Error);
      store.all(type).should.exist;
    });

    it('fails to get a non-existent type', function () {
      expect(store.all.bind(store, 'noExist')).to.throw(Error);
    });

    it('clears a type of its models', function () {
      var model = {
        id: 1
      };
      store.load(type, model);
      store.all(type).get('length').should.equal(1);
      store.clear();
      store.all(type).get('length').should.equal(0);
    });

    it('sorts a modelType container by a given key', function () {
      var key = 'sort';
      var sorted;
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

      store.load(type, models);
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
    beforeEach(function () {
      store.clear();
    });

    it('adds a new model', function () {
      var retrieved;
      var model = {
        id: 999,
        title: 'test title'
      };

      store.load(type, model);
      store.all(type).get('length').should.equal(1);

      retrieved = store.all(type).get('firstObject');
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(model.id);
      retrieved.get('title').should.equal(model.title);
    });

    it('adds a new model wrapped in an array', function () {
      var retrieved;
      var model = [{
        id: 999,
        title: 'test title'
      }];

      store.load(type, model);
      store.all(type).get('length').should.equal(1);

      retrieved = store.all(type).get('firstObject');
      expect(retrieved).to.exist;
      retrieved.get('id').should.equal(model[0].id);
      retrieved.get('title').should.equal(model[0].title);
    });

    it('adds a new model when the DataStore is not empty', function () {
      var retrieved;
      var fill = {
        id: 123,
        title: 'test title 1'
      };
      var model = {
        id: 999,
        title: 'test title 2'
      };

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
      var retrieved;
      var fill = {
        id: 123,
        title: 'test title 1'
      };
      var model = [{
        id: 999,
        title: 'test title 2'
      }];

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
      var retrieved;
      var models = [{
        id: 123,
        title: 'test title 1'
      }, {
        id: 999,
        title: 'test title 2'
      }];

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
      store.load(type, []);
      store.all(type).get('length').should.equal(0);
    });

    it('merges objects when asked', function () {
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

      store.load(type, models);
      store.all(type).get('length').should.equal(5);

      modelType.map(mapFunction).should.deep.equal([[1,10], [2,9], [3,8], [4,7], [5,6]]);
      store._sortBy(type, 'sort').map(mapFunction).should.deep.equal([[5,6], [4,7], [3, 8], [2, 9], [1,10]]);
    });
  });

  describe('searching for models', function () {
    beforeEach(function () {
      store.clear();
    });

    it('binary search works', function () {
      var newSort;
      var find, bSearch, field, i;
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

      store.load(type, models);

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
      newSort = modelType.sortBy('sort');

      for (i = 6; i < 11; ++i) {
        find = newSort.findBy('sort', field);
        bSearch = store._binarySearch(newSort, field);
        expect(find).to.equal(bSearch);
      }

      expect(store._binarySearch(newSort, 5)).to.not.exist;
      expect(store._binarySearch(newSort, 11)).to.not.exist;
    });

    it('returns a single model using search criteria', function () {
      var find;
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
      var find;
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

      store.load(type, models);

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
