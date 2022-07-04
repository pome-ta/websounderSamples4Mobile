import {
  parseValueNum,
  createButton,
  createInputRange,
  createCheckbox,
  setAppendChild,
} from './customDOMfuncs.js';

import { EventWrapper } from './EventWrapper.js';

/* setup document node element */
let selectAudioName;
let volumeRangeValue, volumeRange;
let playbackRateValue, rateRange;
let loopToggleBox;

const setupDOM = () => {
  const mainTitleHeader = document.createElement('h1');
  mainTitleHeader.textContent =
    'AudioBufferSourceNode | オーディオデータの再生';
  mainTitleHeader.style.fontSize = '1rem';
  
  // controller
  const controlView = document.createElement('article');
  controlView.style.width = '92%';
  controlView.style.margin = 'auto';
  

  // SELECT AUDIO FILE
  const selectAudioSection = document.createElement('section');
  selectAudioSection.style.width = '100%';
  const selectAudioCaption = document.createTextNode('SELECT AUDIO FILE : ');
  selectAudioName = document.createElement('span');

  setAppendChild([selectAudioCaption, selectAudioName], selectAudioSection);

  // VOLUME
  const volumeRangeSection = document.createElement('section');
  volumeRangeSection.style.width = '100%';
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

  setAppendChild(
    [volumeRangeCaption, volumeRangeValue, volumeRangeWrap, [volumeRange]],
    volumeRangeSection
  );

  // PLAYBACK RATE
  const playbackRateSection = document.createElement('section');
  playbackRateSection.style.width = '100%';
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

  setAppendChild(
    [playbackRateCaption, playbackRateValue, rateRangeWrap, [rateRange]],
    playbackRateSection
  );

  // LOOP
  const loopToggleSection = document.createElement('section');
  loopToggleSection.style.width = '100%';
  const loopToggleCaption = document.createTextNode('LOOP');

  loopToggleBox = createCheckbox({
    id: 'loopToggle',
  });

  const loopToggleLabel = document.createElement('label');
  //loopToggleLabel.textContent = 'LOOP';
  loopToggleLabel.htmlFor = loopToggleBox.id;
  loopToggleLabel.style.cursor = 'pointer';
  //loopToggleLabel.insertAdjacentElement('afterbegin', loopToggleBox);
  
  

  //setAppendChild([loopToggleLabel], loopToggleSection);
  setAppendChild([loopToggleLabel,[loopToggleBox, loopToggleCaption]], loopToggleSection);

  // overall setup
  setAppendChild([
    mainTitleHeader,
    controlView,[
    selectAudioSection,
    volumeRangeSection,
    playbackRateSection,
    loopToggleSection,
    ]
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
