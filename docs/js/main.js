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

/* setup document node element */
let currentTimeValue;

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
    const currentTimeSection = setAppendChild(
      [captionCurrentTime, currentTimeValue],
      createSection()
    );
    return [currentTimeSection];
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
const buffers = new Array(urls.length);
const sources = new Array(urls.length);

const load = async (url, index) => {
  buffers[index] = await loadSample(context, url);
};

document.addEventListener('DOMContentLoaded', async () => {
  /*  todo: 呼び出し予備
  for (const [index, url] of urls.entries()) {
    await load(url, index);
  }
  // Get base time
  const t0 = context.currentTime;
  console.log(t0);
  for (const [index, buffer] of buffers.entries()) {
    const source = (sources[index] = context.createBufferSource());
    source.buffer = buffer;
    // AudioBufferSourceNode (Input) -> GainNode (Master Volume) -> AudioDestinationNode (Output)
    source.connect(gain);
    gain.connect(context.destination);
    source.start(t0 + index, 0, source.buffer.duration);
    source.stop(t0 + index + source.buffer.duration);
  }
  */
  const t0 = context.currentTime;
  for (const [index, url] of urls.entries()) {
    await load(url, index);
    const source = (sources[index] = context.createBufferSource());
    source.buffer = buffers[index];
    // AudioBufferSourceNode (Input) -> GainNode (Master Volume) -> AudioDestinationNode (Output)
    source.connect(gain);
    gain.connect(context.destination);
    source.start(t0 + index, 0, source.buffer.duration);
    source.stop(t0 + index + source.buffer.duration);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  updateCurrentTime();
});

/*
 * Animation
 */
const FPS = 1;
const frameTime = 1 / FPS;
let prevTimestamp = 0;
let prevCurrentTime;

function updateCurrentTime(timestamp) {
  const elapsed = (timestamp - prevTimestamp) / 1000;
  if (elapsed >= frameTime) {
    prevTimestamp = timestamp;
  //let currentTime = Math.round(context.currentTime * 100) / 100;
  
  const currentTime = context.currentTime;
  if (currentTime !== prevCurrentTime) {
    currentTimeValue.textContent = currentTime;
  }
  //currentTimeValue.textContent = currentTime;
  prevCurrentTime = currentTime;
  }
  
  requestAnimationFrame(updateCurrentTime);
}

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
