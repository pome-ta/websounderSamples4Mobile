import {
  parseValueNum,
  createButton,
  createInputRange,
  setAppendChild,
} from './customDOMfuncs.js';

import { EventWrapper } from './EventWrapper.js';

/* setup document node element */
let sliderValue, sliderRange, soundButton;
const labelValues = ['Play', 'Pause'];

const setupDOM = () => {
  const mainTitleHeader = document.createElement('h1');
  mainTitleHeader.textContent = 'GainNode';

  const buttonWrap = document.createElement('div');
  buttonWrap.style.width = '100%';

  const captionPlayPause = document.createTextNode(labelValues.join(' / '));
  soundButton = createButton('sound', labelValues[0]);

  const sliderWrap = document.createElement('div');
  sliderWrap.style.width = '100%';
  const captionSlider = document.createTextNode('Volume: ');
  sliderValue = document.createElement('span');

  const sliderDiv = document.createElement('div');
  sliderDiv.style.width = '88%';
  sliderDiv.style.margin = 'auto';

  sliderRange = createInputRange({
    id: 'range-volume',
    min: 0.0,
    max: 1.0,
    step: 0.05,
    value: 0.5,
    numtype: 'float',
  });

  setAppendChild([
    mainTitleHeader,
    buttonWrap,
    [captionPlayPause, soundButton],
    sliderWrap,
    [captionSlider, sliderValue],
    sliderDiv,
    [sliderRange],
  ]);
};

setupDOM();

/* audio */
// xxx: prefix は無し
const context = new AudioContext();
let oscillator;
const gain = context.createGain();
gain.gain.value = sliderRange.valueAsNumber; // Set volume
sliderValue.textContent = parseValueNum(sliderRange);

function actionPlayPause() {
  // xxx: ビット排他的理論和処理。無駄に
  const isPlayFlag = labelValues.indexOf(this.textContent) ^ 1;
  if (isPlayFlag) {
    oscillator = context.createOscillator();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(0);
  } else {
    oscillator.stop(0);
  }
  this.textContent = labelValues[isPlayFlag];
}

function controlVolume() {
  // xxx: GLOBAL 定義でもいい？
  const min = gain.gain.minValue || 0;
  const max = gain.gain.maxValue || 1;
  if (this.valueAsNumber >= min && this.valueAsNumber <= max) {
    gain.gain.value = this.valueAsNumber;
    sliderValue.textContent = parseValueNum(this);
  }
}

/* Event */
const eventWrap = new EventWrapper();
soundButton.addEventListener(eventWrap.start, actionPlayPause);
sliderRange.addEventListener('input', controlVolume);

