// http://timkadlec.com/2013/01/windows-phone-8-and-device-width/
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement('style');
  msViewportStyle.appendChild(
    document.createTextNode(
      '@-ms-viewport{width:auto!important}'
    )
  );
  document.getElementsByTagName('head')[0].appendChild(msViewportStyle);
}

// might not be necessary since Ember seems to serialize nested Ember Objects just fine on REST...
function plainObject (EmberObject) {
  var EmO = Em.Object;
  var isArray = Em.isArray;
  var keys = Em.keys(EmberObject);
  var pojo = EmberObject.getProperties(keys);
  var prop;

  // check keys for nested Ember.Objects
  for (var key in pojo) {
    prop = pojo[key];

    // check for Ember.Objects
    if (prop instanceof EmO) {
      pojo[key] = plainObject(prop);
    }

    // check arrays for Ember.Objects
    if (isArray(prop)) {
      pojo[key] = prop = prop.slice();

      for (var i = prop.length - 1; i >= 0; i--) {
        if (prop[i] instanceof EmO) {
          prop[i] = plainObject(prop[i]);
        }
      }
    }
  }
}
