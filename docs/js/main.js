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
let playPauseButton;
let volumeRangeValue, volumeRange;
let playbackRateValue, rateRange;
let audioToggleBox;
let audio;

const labelValues = ['Play', 'Pause'];

const setupDOM = () => {
  const mainTitleHeader = document.createElement('h1');
  mainTitleHeader.textContent =
    'MediaElementAudioSourceNode | オーディオデータの再生';
  mainTitleHeader.style.fontSize = '0.8rem';

  // controller
  const controlView = document.createElement('article');
  controlView.style.width = '92%';
  controlView.style.margin = 'auto';

  // START / PAUSE
  const captionPlayPause = document.createTextNode(labelValues.join(' / '));
  playPauseButton = createButton('sound', labelValues[0]);
  playPauseButton.style.width = '100%';

  const playPauseWrap = setAppendChild(
    [captionPlayPause, playPauseButton],
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

  // audioControls
  const audioToggleCaption = document.createTextNode(' Controls');
  audioToggleBox = createCheckbox({
    id: 'loopToggle',
  });
  const audioToggleLabel = document.createElement('label');
  audioToggleLabel.htmlFor = audioToggleBox.id;
  audioToggleLabel.style.cursor = 'pointer';
  const audioToggleSection = setAppendChild(
    [audioToggleLabel, [audioToggleBox, audioToggleCaption]],
    createSection()
  );

  // Audio
  const audioWrap = document.createElement('div');
  audioWrap.style.width = '100%';

  audio = new Audio(soundPath);
  audio.controls = true;
  audio.style.display = 'block';
  audio.style.width = '100%';
  audio.style.margin = 'auto';
  const audioSection = setAppendChild([audioWrap, [audio]], createSection());

  // overall DOM setup
  setAppendChild([
    mainTitleHeader,
    controlView,
    [
      playPauseWrap,
      volumeRangeSection,
      playbackRateSection,
      audioToggleSection,
      audioSection,
    ],
  ]);
};

setupDOM();

/* audio */
const context = new AudioContext(); // xxx: prefix
const source = context.createMediaElementSource(audio);

const gain = context.createGain();
const gainMin = gain.gain.minValue || 0;
const gainMax = gain.gain.maxValue || 1;
source.connect(gain);
gain.connect(context.destination);

function updateControllers() {
  // xxx: 複数同時に、再描画されるから無駄が多い？
  // Control Master Volume
  if (
    volumeRange.valueAsNumber >= gainMin &&
    volumeRange.valueAsNumber <= gainMax
  ) {
    gain.gain.value = volumeRange.valueAsNumber;
    volumeRangeValue.textContent = parseValueNum(volumeRange);
  }

  if (audio instanceof HTMLAudioElement) {
    // Control playbackRate
    audio.playbackRate = rateRange.valueAsNumber;
    // Audio Controller is visible ?
    audio.style.visibility = audioToggleBox.checked ? 'visible' : 'hidden';
  }
  // Control playbackRate
  playbackRateValue.textContent = parseValueNum(rateRange);
}

/* Events */
const eventWrap = new EventWrapper();

// Audio Controller is visible ?
audioToggleBox.addEventListener(eventWrap.click, updateControllers);
// Control Master Volume
volumeRange.addEventListener('input', updateControllers);
// Control playbackRate
rateRange.addEventListener('input', updateControllers);

playPauseButton.addEventListener(eventWrap.start, function () {
  //context.state === 'suspended' ? context.resume() : null;  // xxx: 読み込みでラグる
  // xxx: ビット排他的理論和処理。無駄に
  const isPlayFlag = labelValues.indexOf(this.textContent) ^ 1;
  isPlayFlag ? audio.play() : audio.pause();
  this.textContent = labelValues[isPlayFlag];
});

document.addEventListener('DOMContentLoaded', updateControllers);

// todo: wake up AudioContext
function initAudioContext() {
  document.removeEventListener(eventWrap.start, initAudioContext);
  context.resume();
}
document.addEventListener(eventWrap.start, initAudioContext);
