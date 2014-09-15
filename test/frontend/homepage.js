describe('homepage', function () {
  beforeEach(function () {
    visit('/');
  });

  afterEach(function () {
    App.reset();
  });

  it('should redirect to /groups', function () {
    expect(currentURL()).to.equal('/groups');
  });
});
