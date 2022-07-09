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

const setupDOM = () => {
  const _ = 1;
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
  for (const [index, url] of urls.entries()) {
    await load(url, index);
  }
  // Get base time
  const t0 = context.currentTime;
  for (const [index, buffer] of buffers.entries()) {
    const source = (sources[index] = context.createBufferSource());
    source.buffer = buffer;
    // AudioBufferSourceNode (Input) -> GainNode (Master Volume) -> AudioDestinationNode (Output)
    source.connect(gain);
    gain.connect(context.destination);
    source.start(t0 + index, 0, source.buffer.duration);
    source.stop(t0 + index + source.buffer.duration);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const _ = 1;
});

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
