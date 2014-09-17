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
});
