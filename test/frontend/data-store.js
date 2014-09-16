describe('DataStore', function () {
  var store;

  beforeEach(function () {
    visit('/');
  });

  afterEach(function () {
    App.reset();
  });

  it('should push preloaded data into the store', function() {
    var allGroups, testGroup;
    var now = new Date();
    var groups = [{
        id: 999,
        title: 'test group',
        order: 0,
        date: now,
        fields: '[]'
    }];

    // attach GroupModel preload data
    var meta = document.createElement('meta');
    meta.setAttribute('name', 'preload-groups');
    meta.setAttribute('content', JSON.stringify(groups));
    document.head.appendChild(meta);

    // restart the app so it can get the preload
    Ember.run(function () {
      App.reset();
    });

    visit('groups');

    andThen(function () {
      store = App.__container__.lookup('store:main');
      allGroups = store.all('groups');
      testGroup = allGroups.objectAt(0);

      window.b = testGroup;
      expect(allGroups.get('length')).to.equal(1);
      expect(testGroup).to.exist;
      expect(testGroup.title).to.equal(groups[0].title);
      expect(testGroup.id).to.equal(groups[0].id);
      document.head.removeChild(meta);
    });
  });
});
