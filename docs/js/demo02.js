'use strict';

// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan:
    typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved:
    typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded:
    typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

/* audio */
// xxx: prefix は無し
const context = new AudioContext();

const oscillator = context.createOscillator();
oscillator.connect(context.destination);
oscillator.start(0);

// todo: 着火のおまじない
const initAudioContext = () => {
  document.removeEventListener(touchEnded, initAudioContext);
  // wake up AudioContext
  context.resume();
  // Stop sound (after 1 sec)
  window.setTimeout(() => {
    oscillator.stop(0);
  }, 1000);
};
document.addEventListener(touchEnded, initAudioContext);
