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

function setupRangeToSectionInputValue(
  inputElement,
  textCaptionStr,
  unitCaptionStr = null
) {
  const textNodeCaption = document.createTextNode(textCaptionStr);
  const inputValue = document.createElement('span');
  const textNodeUnit =
    unitCaptionStr === null ? null : document.createTextNode(unitCaptionStr);
  const wrap = document.createElement('div');
  wrap.style.width = '88%';
  wrap.style.margin = 'auto';
  const rangeSection = setAppendChild(
    [textNodeCaption, inputValue, textNodeUnit, wrap, [inputElement]].filter(
      (child) => child !== null
    ),
    createSection()
  );
  return [rangeSection, inputValue];
}

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
  'allpass',
];
let typeSelect;
let cutoffRangeValue, cutoffRange;
let qualityRangeValue, qualityRange;
let gainfilterRangeValue, gainfilterRange;

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
    let volumeRangeSection;
    volumeRange = createInputRange({
      id: 'range-volume',
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: 1.0,
      numtype: 'float',
    });
    [volumeRangeSection, volumeRangeValue] = setupRangeToSectionInputValue(
      volumeRange,
      'VOLUME : '
    );

    // PLAYBACK RATE
    let playbackRateSection;
    rateRange = createInputRange({
      id: 'range-playback-rate',
      min: 0.05,
      max: 2.0,
      step: 0.05,
      value: 1.0,
      numtype: 'float',
    });
    [playbackRateSection, playbackRateValue] = setupRangeToSectionInputValue(
      rateRange,
      'PLAYBACK RATE : '
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

    return [
      playPauseWrap,
      volumeRangeSection,
      playbackRateSection,
      audioToggleSection,
      audioSection,
    ];
  };

  /* DELAY controller */
  const setupDelayController = () => {
    // DELAY
    let delayRangeSection;
    delayRange = createInputRange({
      id: 'range-delay-time',
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: 0.0,
      numtype: 'float',
    });
    [delayRangeSection, delayRangeValue] = setupRangeToSectionInputValue(
      delayRange,
      'DELAY : ',
      ' sec'
    );

    // DRY
    let dryRangeSection;
    dryRange = createInputRange({
      id: 'range-delay-dry',
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: 1.0,
      numtype: 'float',
    });
    [dryRangeSection, dryRangeValue] = setupRangeToSectionInputValue(
      dryRange,
      'DRY : '
    );

    // WET
    let wetRangeSection;
    wetRange = createInputRange({
      id: 'range-delay-wet',
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: 0.0,
      numtype: 'float',
    });
    [wetRangeSection, wetRangeValue] = setupRangeToSectionInputValue(
      wetRange,
      'WET : '
    );

    // FEEDBACK
    let feedbackRangeSection;
    feedbackRange = createInputRange({
      id: 'range-delay-feedback',
      min: 0.0,
      max: 1.0,
      step: 0.05,
      value: 0.0,
      numtype: 'float',
    });
    [feedbackRangeSection, feedbackRangeValue] = setupRangeToSectionInputValue(
      feedbackRange,
      'FEEDBACK : '
    );

    return [
      delayRangeSection,
      dryRangeSection,
      wetRangeSection,
      feedbackRangeSection,
    ];
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
      options: filterTypes,
    });
    const filterTypeSection = setAppendChild(
      [filterTypeCaption, filterTypeWrap, [typeSelect]],
      createSection()
    );

    //CUTOFF
    let cutoffRangeSection;
    cutoffRange = createInputRange({
      id: 'range-cutoff',
      min: 20,
      max: 8000,
      value: 350,
      numtype: 'int',
    });
    [cutoffRangeSection, cutoffRangeValue] = setupRangeToSectionInputValue(
      cutoffRange,
      'CUTOFF : ',
      ' Hz'
    );

    // Q
    let qualityRangeSection;
    qualityRange = createInputRange({
      id: 'range-Q',
      min: 0,
      max: 20,
      value: 1,
      numtype: 'int',
    });
    [qualityRangeSection, qualityRangeValue] = setupRangeToSectionInputValue(
      qualityRange,
      'Q : '
    );

    // GAIN
    let gainfilterRangeSection;
    gainfilterRange = createInputRange({
      id: 'range-filter-gain',
      min: -18,
      max: 18,
      value: 1,
      numtype: 'int',
    });
    [gainfilterRangeSection, gainfilterRangeValue] =
      setupRangeToSectionInputValue(gainfilterRange, 'GAIN : ', ' dB');

    return [
      filterTypeSection,
      cutoffRangeSection,
      qualityRangeSection,
      gainfilterRangeSection,
    ];
  };

  /* article setting */
  const mainControlView = setAppendChild(
    setupMainController(),
    document.createElement('article')
  );
  const delayControlView = setAppendChild(
    setupDelayController(),
    document.createElement('article')
  );
  const filterControlView = setAppendChild(
    setupFilterController(),
    document.createElement('article')
  );

  [mainControlView, delayControlView, filterControlView].forEach((views) => {
    views.style.width = '92%';
    views.style.margin = '1rem auto';
  });
  // overall DOM setup
  setAppendChild([
    mainTitleHeader,
    mainControlView,
    delayControlView,
    filterControlView,
  ]);
};

setupDOM();

/* audio */
const context = new AudioContext(); // xxx: prefix
const source = context.createMediaElementSource(audio);

const gain = context.createGain();
const gainMin = gain.gain.minValue || 0;
const gainMax = gain.gain.maxValue || 1;

// Delay
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

// Filter
const filter = context.createBiquadFilter();

const minCutoff = filter.frequency.minValue || 10;
const maxCutoff = filter.frequency.maxValue || context.sampleRate / 2;
const minQ = filter.Q.minValue || 0.0001;
const maxQ = filter.Q.maxValue || 1000;
const minGainFilter = filter.gain.minValue || -40;
const maxGainFilter = filter.gain.maxValue || 40;

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

// MediaElementAudioSourceNode (Input) -> BiquadFilterNode (Filter) -> Delay (Delay) -> GainNode (Master Volume) -> AudioDestinationNode (Output)
source.connect(filter);
filter.connect(delayIn);
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

  // Select Filte Type
  filter.type = typeSelect.value;
  // Control Cutoff
  if (
    cutoffRange.valueAsNumber >= minCutoff &&
    cutoffRange.valueAsNumber <= maxCutoff
  ) {
    filter.frequency.value = cutoffRange.valueAsNumber;

    cutoffRangeValue.textContent = parseValueNum(cutoffRange);
  }
  // Control Q (Quality Factor)
  if (
    qualityRange.valueAsNumber >= minQ &&
    qualityRange.valueAsNumber <= maxQ
  ) {
    filter.Q.value = qualityRange.valueAsNumber;
    qualityRangeValue.textContent = parseValueNum(qualityRange);
  }
  // Control Filter Gain
  if (
    gainfilterRange.valueAsNumber >= minGainFilter &&
    gainfilterRange.valueAsNumber <= maxGainFilter
  ) {
    filter.gain.value = gainfilterRange.valueAsNumber;
    gainfilterRangeValue.textContent = parseValueNum(gainfilterRange);
  }
}

/* Events */
const eventWrap = new EventWrapper();

audio.addEventListener('ended', ()=>{
console.log('end');
});

// Audio Controller is visible ?
audioToggleBox.addEventListener(eventWrap.click, updateControllers);

typeSelect.addEventListener('change', updateControllers);

[
  volumeRange,
  rateRange,
  delayRange,
  dryRange,
  wetRange,
  feedbackRange,
  cutoffRange,
  qualityRange,
  gainfilterRange,
].forEach((slider) => slider.addEventListener('input', updateControllers));

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
