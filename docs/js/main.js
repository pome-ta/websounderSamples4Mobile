import {
  parseValueNum,
  createButton,
  createInputRange,
  createCheckbox,
  createSection,
  setAppendChild,
} from './customDOMfuncs.js';

import { EventWrapper } from './EventWrapper.js';

/* setup document node element */
let selectAudioName, fileUploadAudioButton;
let volumeRangeValue, volumeRange;
let playbackRateValue, rateRange;
let loopToggleBox;
let stopAudioButton;

let playPauseButton;
const labelValues = ['Play', 'Pause'];

const setupDOM = () => {
  //audio = document.createElement('audio');
  //audio.setAttribute('src', soundPath);
  //audio.src = soundPath;
  const mainTitleHeader = document.createElement('h1');
  mainTitleHeader.textContent =
    'MediaElementAudioSourceNode | オーディオデータの再生';
  mainTitleHeader.style.fontSize = '1rem';

  // controller
  const controlView = document.createElement('article');
  controlView.style.width = '92%';
  controlView.style.margin = 'auto';

  const captionPlayPause = document.createTextNode(labelValues.join(' / '));
  playPauseButton = createButton('sound', labelValues[0]);

  const buttonWrap = setAppendChild(
    [captionPlayPause, playPauseButton],
    createSection()
  );

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
      buttonWrap,
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
const soundPath = './sounds/loop.wav';
const audio = new Audio(soundPath);

const context = new AudioContext(); // xxx: prefix
const source = context.createMediaElementSource(audio);
source.connect(context.destination);

function actionPlayPause() {
  // xxx: ビット排他的理論和処理。無駄に
  const isPlayFlag = labelValues.indexOf(this.textContent) ^ 1;
  isPlayFlag ? audio.play() : audio.pause();
  this.textContent = labelValues[isPlayFlag];
}

/* Events */
const eventWrap = new EventWrapper();

playPauseButton.addEventListener(eventWrap.start, actionPlayPause);

// todo: wake up AudioContext
function initAudioContext() {
  document.removeEventListener(eventWrap.start, initAudioContext);
  context.resume();
}
document.addEventListener(eventWrap.start, initAudioContext);
