describe('homepage', function () {
  beforeEach(function () {
    visit('/');
  });

  afterEach(function () {
    App.reset();
  });

  it('redirects to /groups', function () {
    expect(currentURL()).to.equal('/groups');
  });

  it('pushes preloaded data into the store', function() {
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

    document.head.removeChild(meta);

    andThen(function () {
      var store = App.__container__.lookup('store:main'),
          testGroup = store.find('groups', 999);

      store.all('groups').get('length').should.equal(1);

      expect(testGroup).to.exist;
      testGroup.title.should.equal(groups[0].title);
    });
  });
});
