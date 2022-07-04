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
  mainTitleHeader.textContent = 'AudioBufferSourceNode | オーディオデータの再生';
  
  // SELECT AUDIO FILE
  const selectAudioSection = document.createElement('section');
  selectAudioSection.style.width = '100%';
  const selectAudioCaption = document.createTextNode('SELECT AUDIO FILE :');
  const selectAudioName = document.createElement('span');
  
  setAppendChild([selectAudioCaption, selectAudioName], selectAudioSection);
  
  // VOLUME
  const volumeRangeSection = document.createElement('section');
  volumeRangeSection.style.width = '100%';
  const volumeRangeCaption = document.createTextNode('VOLUME : ');
  const volumeRangeValue = document.createElement('span');
  
  const volumeRangeWrap = document.createElement('div');
  volumeRangeWrap.style.width = '88%';
  volumeRangeWrap.style.margin = 'auto';
  const volumeRange = createInputRange({
    id: 'range-volume',
    min: 0.0,
    max: 1.0,
    step: 0.05,
    value: 0.5,
    numtype: 'float',
  });
  
  setAppendChild([volumeRangeCaption, volumeRangeValue, volumeRangeWrap,[volumeRange]], volumeRangeSection)
  
  
  
  

  const buttonWrap = document.createElement('div');
  buttonWrap.style.width = '100%';

  const captionPlayPause = document.createTextNode(labelValues.join(' / '));
  soundButton = createButton('sound', labelValues[0]);

  

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
    selectAudioSection,
    volumeRangeSection,
    sliderDiv,
    [sliderRange],
  ]);
};

setupDOM();

/* audio */
// xxx: prefix は無し
const context = new AudioContext();

async function LoadSample(actx, url) {
  const res = await fetch(url);
  const arraybuf = await res.arrayBuffer();
  return actx.decodeAudioData(arraybuf);
}


/* Event */
const eventWrap = new EventWrapper();

