var matchMedia = window.matchMedia,
    smallMax = 640,
    mediumMax = 1024;

function smallScreen () {
  return matchMedia('screen and (max-device-width: ' + smallMax + 'px)').matches;
}

function mediumScreen () {
  var min = smallMax + 1;
  return matchMedia('screen and (min-device-width: ' + min + 'px) and (max-device-width: ' + mediumMax + 'px)').matches;
}

function largeScreen () {
  var min = mediumMax + 1;
  return matchMedia('screen and (min-device-width: ' + min + 'px)').matches;
}

function notSmall () {
  var min = smallMax + 1;
  return matchMedia('screen and (min-device-width: ' + min + 'px)').matches;
}

export default {
  smallScreen: smallScreen,
  mediumScreen: mediumScreen,
  largeScreen: largeScreen,
  notSmall: notSmall,
};
