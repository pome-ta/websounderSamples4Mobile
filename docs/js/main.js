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
// for the instances of AudioBuffer
const buffers = new Array(urls.length);
// for the instances of AudioBufferSourceNode
const sources = new Array(urls.length);

const load = async (url, index) => {
  buffers[index] = await loadSample(context, url);
};

document.addEventListener('DOMContentLoaded', async () => {
  for (let i = 0, len = urls.length; i < len; i++) {
    await load(urls[i], i);
  }
  // Get base time
  const t0 = context.currentTime;
  for (var i = 0, len = buffers.length; i < len; i++) {
    // Create the instance of AudioBufferSourceNode
    sources[i] = context.createBufferSource();
    // Set the instance of AudioBuffer
    sources[i].buffer = buffers[i];
    // AudioBufferSourceNode (Input) -> GainNode (Master Volume) -> AudioDestinationNode (Output)
    sources[i].connect(gain);
    gain.connect(context.destination);
    sources[i].start(t0 + i, 0, sources[i].buffer.duration);
    sources[i].stop(t0 + i + sources[i].buffer.duration);
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
