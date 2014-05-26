var GroupsView = Em.View.extend({
  classNameBindings: ['groups', 'animateMe:yoyo:yaya'],
  init: function () {
    this._super();
    this.one('click', this, function (e) { console.log('clicked !! ', this, e)});
    window.a = this;
  },

  tryThis: function () {
    var yesnow = this.get('controller.yesnow');

    if (yesnow === 1) {
      this.set('animateMe', true);
      console.log('-----yesnow is true')
    } else {
      this.set('animateMe', false);
      console.log('-----yesnow is false')
    }
  }.observes('controller.yesnow')
});

export default GroupsView;
