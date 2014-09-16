describe('DataStore', function () {
  var store;

  beforeEach(function () {
    visit('/');
    store = App.__container__.lookup('store:main');
  });

  afterEach(function () {
    store = null;
    App.reset();
  });

  it('should ', function () {
    expect(1);
    console.log(store);
  });
});
