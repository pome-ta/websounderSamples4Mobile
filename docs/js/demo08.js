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
    unitCaptionStr !== null ? document.createTextNode(unitCaptionStr) : null;
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

/* setup document node element */
let currentTimeValue;
let startButton;
let volumeRangeValue, volumeRange;
let playbackRateValue, rateRange;
let intervalRangeValue, intervalRange;

const setupDOM = () => {
  const mainTitleHeader = document.createElement('h1');
  mainTitleHeader.textContent =
    'サウンドスケジューリング | オーディオデータの再生';
  mainTitleHeader.style.fontSize = '0.8rem';

  /* main controller */
  const setupMainController = () => {
    // currentTime
    const captionCurrentTime = document.createTextNode(
      'AudioContext currentTimeプロパティ'
    );
    currentTimeValue = document.createElement('p');
    //currentTimeValue.style.margin = 0;
    const currentTimeSection = setAppendChild(
      [captionCurrentTime, currentTimeValue],
      createSection()
    );

    // START
    const captionStart = document.createTextNode('START');
    startButton = createButton('start', '▶︎');
    startButton.style.width = '100%';
    const startButtonSection = setAppendChild(
      [captionStart, startButton],
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

    // INTERVAL
    let intervalRangeSection;
    intervalRange = createInputRange({
      id: 'range-interval',
      min: 0.0,
      max: 1.0,
      step: 0.01,
      value: 1.0,
      numtype: 'float',
    });
    [intervalRangeSection, intervalRangeValue] = setupRangeToSectionInputValue(
      intervalRange,
      'INTERVAL : ',
      ' sec'
    );

    return [
      currentTimeSection,
      startButtonSection,
      volumeRangeSection,
      playbackRateSection,
      intervalRangeSection,
    ];
  };

  /* article setting */
  const mainControlView = setAppendChild(
    setupMainController(),
    document.createElement('article')
  );

  [mainControlView].forEach((views) => {
    views.style.width = '92%';
    views.style.margin = '1rem auto';
  });

  // overAll DOM setup
  setAppendChild([mainTitleHeader, mainControlView]);
};

setupDOM();

/*
 * Audio
 */

async function loadSample(actx, uri) {
  const res = await fetch(uri);
  const arraybuf = await res.arrayBuffer();
  return actx.decodeAudioData(arraybuf);
}

const rootPath = './sounds/toneOneshot/';
const tones = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5'];
const urls = tones.map((tone) => `${rootPath}${tone}.wav`);

const context = new AudioContext();
const gain = context.createGain();
const gainMin = gain.gain.minValue || 0;
const gainMax = gain.gain.maxValue || 1;

const buffers = new Array(urls.length);
const sources = new Array(urls.length);

const load = async (url, index) => {
  buffers[index] = await loadSample(context, url);
};

document.addEventListener('DOMContentLoaded', async () => {
  for (const [index, url] of urls.entries()) {
    await load(url, index);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  currentTimeValue.textContent = context.currentTime;
  updateCurrentTime();
  updateControllers();
});

/*
 * Animation
 */
const FPS = 30;
const frameTime = 1 / FPS;
let prevTimestamp = 0;

function updateCurrentTime(timestamp) {
  const elapsed = (timestamp - prevTimestamp) / 1000;
  if (elapsed >= frameTime) {
    prevTimestamp = timestamp;
    currentTimeValue.textContent = context.currentTime;
  }
  requestAnimationFrame(updateCurrentTime);
}

/*
 * Events
 */
const eventWrap = new EventWrapper();

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
  // Control playbackRate
  playbackRateValue.textContent = parseValueNum(rateRange);

  // Control interval
  intervalRangeValue.textContent = parseValueNum(intervalRange);
}

startButton.addEventListener(eventWrap.click, () => {
  const t0 = context.currentTime;
  const interval = intervalRange.valueAsNumber;
  buffers.forEach((buffer, index) => {
    const source = (sources[index] = context.createBufferSource());
    source.buffer = buffer;

    const playbackRate = rateRange.valueAsNumber;
    source.playbackRate.value = playbackRate;

    // AudioBufferSourceNode (Input) -> GainNode (Master Volume) -> AudioDestinationNode (Output)
    source.connect(gain);
    gain.connect(context.destination);

    const intervalIndex = interval * index;
    const durationPlaybackRate = source.buffer.duration / playbackRate;

    const startTime = [t0 + intervalIndex, 0, durationPlaybackRate];
    const stopTime = t0 + intervalIndex + durationPlaybackRate;

    source.start(...startTime);
    source.stop(stopTime);
  });
});

[volumeRange, rateRange, intervalRange].forEach((slider) =>
  slider.addEventListener('input', updateControllers)
);

// todo: wake up AudioContext
function initAudioContext() {
  document.removeEventListener(eventWrap.start, initAudioContext);
  context.resume();
}
//document.addEventListener(eventWrap.start, initAudioContext);
