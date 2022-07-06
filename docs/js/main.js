import {
  parseValueNum,
  createButton,
  createInputRange,
  createCheckbox,
  createSection,
  setAppendChild,
} from './customDOMfuncs.js';

import { EventWrapper } from './EventWrapper.js';




const soundPath = './sounds/loop.wav';
/* setup document node element */
let audio;
let selectAudioName, fileUploadAudioButton;
let volumeRangeValue, volumeRange;
let playbackRateValue, rateRange;
let loopToggleBox;
let stopAudioButton;

const setupDOM = () => {
  audio = document.createElement('audio');
  //audio.setAttribute('src', soundPath);
  audio.src = soundPath;
  const mainTitleHeader = document.createElement('h1');
  mainTitleHeader.textContent =
    'AudioBufferSourceNode | オーディオデータの再生';
  mainTitleHeader.style.fontSize = '1rem';

  // controller
  const controlView = document.createElement('article');
  controlView.style.width = '92%';
  controlView.style.margin = 'auto';

  // SELECT AUDIO FILE
  const selectAudioCaption = document.createTextNode('SELECT AUDIO FILE : ');
  selectAudioName = document.createElement('span');
  fileUploadAudioButton = createButton('file-upload-audio', 'Upload');
  const selectAudioSection = setAppendChild(
    [selectAudioCaption, selectAudioName, fileUploadAudioButton],
    createSection()
  );

  // VOLUME
  const volumeRangeCaption = document.createTextNode('VOLUME : ');
  volumeRangeValue = document.createElement('span');
  const volumeRangeWrap = document.createElement('div');
  volumeRangeWrap.style.width = '88%';
  volumeRangeWrap.style.margin = 'auto';
  volumeRange = createInputRange({
    id: 'range-volume',
    min: 0.0,
    max: 1.0,
    step: 0.05,
    value: 1.0,
    numtype: 'float',
  });
  const volumeRangeSection = setAppendChild(
    [volumeRangeCaption, volumeRangeValue, volumeRangeWrap, [volumeRange]],
    createSection()
  );

  // PLAYBACK RATE
  const playbackRateCaption = document.createTextNode('PLAYBACK RATE : ');
  playbackRateValue = document.createElement('span');
  const rateRangeWrap = document.createElement('div');
  rateRangeWrap.style.width = '88%';
  rateRangeWrap.style.margin = 'auto';
  rateRange = createInputRange({
    id: 'range-playback-rate',
    min: 0.05,
    max: 2.0,
    step: 0.05,
    value: 1.0,
    numtype: 'float',
  });
  const playbackRateSection = setAppendChild(
    [playbackRateCaption, playbackRateValue, rateRangeWrap, [rateRange]],
    createSection()
  );

  // LOOP
  const loopToggleCaption = document.createTextNode(' LOOP');
  loopToggleBox = createCheckbox({
    id: 'loopToggle',
  });
  const loopToggleLabel = document.createElement('label');
  loopToggleLabel.htmlFor = loopToggleBox.id;
  loopToggleLabel.style.cursor = 'pointer';
  const loopToggleSection = setAppendChild(
    [loopToggleLabel, [loopToggleBox, loopToggleCaption]],
    createSection()
  );

  const stopButtonWrap = document.createElement('div');
  stopButtonWrap.style.padding = '2rem';
  stopButtonWrap.style.margin = 'auto';
  stopAudioButton = createButton('stop', '🤚 Stop Audio');

  // overall DOM setup
  setAppendChild([
    mainTitleHeader,
    controlView,
    [
      selectAudioSection,
      volumeRangeSection,
      playbackRateSection,
      loopToggleSection,
      stopButtonWrap,
      [stopAudioButton],
    ],
  ]);
};

setupDOM();

/* audio */
//const soundPath = './sounds/loop.wav';
const context = new AudioContext(); // xxx: prefix
const source = context.createMediaElementSource(audio);
source.connect(context.destination);


/* Events */
const eventWrap = new EventWrapper();

// todo: wake up AudioContext
function initAudioContext() {
  document.removeEventListener(eventWrap.start, initAudioContext);
  context.resume();
}
//document.addEventListener(eventWrap.start, initAudioContext);
