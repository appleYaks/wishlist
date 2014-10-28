function getTransitionEndName () {
  var el = document.createElement('transitionEndNameTest'),
      transitionEndEventNames;

  transitionEndEventNames = {
    'transition'       : 'transitionend',
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition'    : 'transitionend',
    'OTransition'      : 'oTransitionEnd',
    'msTransition'     : 'MSTransitionEnd',
  };

  for (var name in transitionEndEventNames) {
    if (typeof el.style[name] !== 'undefined') {
      return transitionEndEventNames[name];
    }
  }
}

export default getTransitionEndName();
