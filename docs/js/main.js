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
const labelValues = ['Play', 'Pause'];
let playPauseButton;
let volumeRangeValue, volumeRange;
let playbackRateValue, rateRange;
let audioToggleBox;
let audio;

let delayRangeValue, delayRange;
let dryRangeValue, dryRange;
let wetRangeValue, wetRange;
let feedbackRangeValue, feedbackRange;

const filterTypes = [
  'lowpass',
  'highpass',
  'bandpass',
  'lowshelf',
  'highshelf',
  'peaking',
  'notch',
  'allpass'
];
let typeSelect;
let cutoffRateValue, cutoffRange;

const setupDOM = () => {
  const mainTitleHeader = document.createElement('h1');
  mainTitleHeader.textContent =
    'MediaElementAudioSourceNode | オーディオデータの再生';
  mainTitleHeader.style.fontSize = '0.8rem';

  /* main controller */
  const setupMainController = () => {
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

    return setAppendChild(
      [
        playPauseWrap,
        volumeRangeSection,
        playbackRateSection,
        audioToggleSection,
        audioSection,
      ],
      document.createElement('article')
    );
  };

  /* DELAY controller */
  const setupDelayController = () => {
    // DELAY
    const delayRangeCaption = document.createTextNode('DELAY : ');
    delayRangeValue = document.createElement('span');
    const delayUnitCaption = document.createTextNode(' sec');
    const delayRangeWrap = document.createElement('div');
    delayRangeWrap.style.width = '88%';
    delayRangeWrap.style.margin = 'auto';
    delayRange = createInputRange({
      id: 'range-delay-time',
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: 0.0,
      numtype: 'float',
    });
    const delayRangeSection = setAppendChild(
      [
        delayRangeCaption,
        delayRangeValue,
        delayUnitCaption,
        delayRangeWrap,
        [delayRange],
      ],
      createSection()
    );

    // DRY
    const dryRangeCaption = document.createTextNode('DRY : ');
    dryRangeValue = document.createElement('span');
    const dryRangeWrap = document.createElement('div');
    dryRangeWrap.style.width = '88%';
    dryRangeWrap.style.margin = 'auto';
    dryRange = createInputRange({
      id: 'range-delay-dry',
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: 1.0,
      numtype: 'float',
    });
    const dryRangeSection = setAppendChild(
      [dryRangeCaption, dryRangeValue, dryRangeWrap, [dryRange]],
      createSection()
    );

    // WET
    const wetRangeCaption = document.createTextNode('WET : ');
    wetRangeValue = document.createElement('span');
    const wetRangeWrap = document.createElement('div');
    wetRangeWrap.style.width = '88%';
    wetRangeWrap.style.margin = 'auto';
    wetRange = createInputRange({
      id: 'range-delay-wet',
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: 0.0,
      numtype: 'float',
    });
    const wetRangeSection = setAppendChild(
      [wetRangeCaption, wetRangeValue, wetRangeWrap, [wetRange]],
      createSection()
    );

    // FEEDBACK
    const feedbackRangeCaption = document.createTextNode('FEEDBACK : ');
    feedbackRangeValue = document.createElement('span');
    const feedbackRangeWrap = document.createElement('div');
    feedbackRangeWrap.style.width = '88%';
    feedbackRangeWrap.style.margin = 'auto';
    feedbackRange = createInputRange({
      id: 'range-delay-feedback',
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: 0.0,
      numtype: 'float',
    });
    const feedbackRangeSection = setAppendChild(
      [
        feedbackRangeCaption,
        feedbackRangeValue,
        feedbackRangeWrap,
        [feedbackRange],
      ],
      createSection()
    );

    return setAppendChild(
      [
        delayRangeSection,
        dryRangeSection,
        wetRangeSection,
        feedbackRangeSection,
      ],
      document.createElement('article')
    );
  };

  /* FILTER controller */
  const setupFilterController = () => {
    // FILTER TYPE
    const filterTypeCaption = document.createTextNode('FILTER TYPE : ');
    const filterTypeWrap = document.createElement('div');
    filterTypeWrap.style.width = '88%';
    filterTypeWrap.style.margin = 'auto';
    typeSelect = createSelectOpitons({
      id: 'select-filter',
      options: filterTypes
    });
    const filterTypeSection = setAppendChild(
      [
        filterTypeCaption,filterTypeWrap,
        [typeSelect,]
      ],
      createSection()
    );
    
    //CUTOFF
    const cutoffRangeCaption = document.createTextNode('CUTOFF : ');
    cutoffRateValue = document.createElement('span');
    const cutoffUnitCaption = document.createTextNode(' Hz');
    const cutoffRangeWrap = document.createElement('div');
    cutoffRangeWrap.style.width = '88%';
    cutoffRangeWrap.style.margin = 'auto';
    cutoffRange = createInputRange({
      id: 'range-cutoff',
      min: 20,
      max: 8000,
      value: 350,
      numtype: 'int',
    });
    const cutoffRangeSection = setAppendChild(
      [cutoffRangeCaption, cutoffRateValue, cutoffUnitCaption, cutoffRangeWrap, [cutoffRange]],
      createSection()
    );
    
    
    
    return setAppendChild(
      [
        filterTypeSection,
        cutoffRangeSection
        
      ],
      document.createElement('article')
    );
    
  };

  const mainControlView = setupMainController();
  const delayControlView = setupDelayController();
  const filterControlView = setupFilterController();

  [mainControlView, delayControlView, filterControlView].forEach((views) => {
    views.style.width = '92%';
    views.style.margin = '1rem auto';
  });
  // overall DOM setup
  setAppendChild([mainTitleHeader, mainControlView, delayControlView, filterControlView]);
};

setupDOM();

/* audio */
const context = new AudioContext(); // xxx: prefix
const source = context.createMediaElementSource(audio);

const gain = context.createGain();
const gainMin = gain.gain.minValue || 0;
const gainMax = gain.gain.maxValue || 1;

const delay = context.createDelay();
const delayIn = context.createGain();
const delayOut = context.createGain();
const dry = context.createGain();
const wet = context.createGain();
const feedback = context.createGain();

delayIn.gain.value = 1.0;
delayOut.gain.value = 1.0;
dry.gain.value = parseValueNum(dryRange);
wet.gain.value = parseValueNum(wetRange);
feedback.gain.value = parseValueNum(feedbackRange);

const minDelayTime = delay.delayTime.minValue || 0;
const maxDelayTime = delay.delayTime.maxValue || 1;
const minDry = dry.gain.minValue || 0;
const maxDry = dry.gain.maxValue || 1;
const minWet = wet.gain.minValue || 0;
const maxWet = wet.gain.maxValue || 1;
const minFeedback = feedback.gain.minValue || 0;
const maxFeedback = feedback.gain.maxValue || 1;

// GainNode (Input) -> GainNode (Dry) -> GainNode (Output)
delayIn.connect(dry);
dry.connect(delayOut);
// GainNode (Input) -> DelayNode (Delay) -> GainNode (Wet) -> GainNode (Output)
delayIn.connect(delay);
delay.connect(wet);
wet.connect(delayOut);

// (GainNode (Input) ->) DelayNode (Delay) -> GainNode (Feedback) -> DelayNode (Delay) ...
delay.connect(feedback);
feedback.connect(delay);

source.connect(delayIn);
delayOut.connect(gain);
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

  // Control Delay Time
  if (
    delayRange.valueAsNumber >= minDelayTime &&
    delayRange.valueAsNumber <= maxDelayTime
  ) {
    delay.delayTime.value = delayRange.valueAsNumber;
    delayRangeValue.textContent = parseValueNum(delayRange);
  }

  // Control Delay Dry
  if (dryRange.valueAsNumber >= minDry && dryRange.valueAsNumber <= maxDry) {
    dry.gain.value = dryRange.valueAsNumber;
    dryRangeValue.textContent = parseValueNum(dryRange);
  }
  // Control Delay Wet
  if (wetRange.valueAsNumber >= minWet && wetRange.valueAsNumber <= maxWet) {
    wet.gain.value = wetRange.valueAsNumber;
    wetRangeValue.textContent = parseValueNum(wetRange);
  }
  // Control Delay Feedback
  if (
    feedbackRange.valueAsNumber >= minFeedback &&
    feedbackRange.valueAsNumber <= maxFeedback
  ) {
    feedback.gain.value = feedbackRange.valueAsNumber;
    feedbackRangeValue.textContent = parseValueNum(feedbackRange);
  }
}

/* Events */
const eventWrap = new EventWrapper();

// Audio Controller is visible ?
audioToggleBox.addEventListener(eventWrap.click, updateControllers);

[volumeRange, rateRange, delayRange, dryRange, wetRange, feedbackRange].forEach(
  (slider) => slider.addEventListener('input', updateControllers)
);

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
