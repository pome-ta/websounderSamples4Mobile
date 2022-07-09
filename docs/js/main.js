import {
  parseValueNum,
  createButton,
  createInputRange,
  createCheckbox,
  createSelectOpitons,
  createSection,
  setAppendChild,
} from './customDOMfuncs.js';

import { EventWrapper } from './EventWrapper.js';

const soundPath = './sounds/loop.wav';


/* setup document node element */

const setupDOM = () => {
  const _ = 1;
};

setupDOM();

/*
 * Audio
 */
const context = new AudioContext();


/*
 * Events
 */
const eventWrap = new EventWrapper();


// todo: wake up AudioContext
function initAudioContext() {
  document.removeEventListener(eventWrap.start, initAudioContext);
  context.resume();
}
document.addEventListener(eventWrap.start, initAudioContext);
