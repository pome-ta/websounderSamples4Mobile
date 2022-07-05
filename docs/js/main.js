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
const context = new AudioContext(); // xxx: prefix
let source = null;
const gain = context.createGain();

function _startAudio(arrayBuffer) {
  source = context.createBufferSource();
  /*const audioBuffer = context.decodeAudioData(arrayBuffer).then((decodedData) => {
    //console.log(decodedData);
    return decodedData;
  });*/

  //decodeAudioData
  //const audioBuffer = await LoadBuffer(context, )

  //context.decodeAudioData(arrayBuffer, successCallback, errorCallback);
  //source.buffer = audioBuffer;
  //source.buffer = audioBuffer;
  //source.playbackRate.value = rateRange.valueAsNumber;
  //source.loop = loopToggleBox.checked;

  // AudioBufferSourceNode (Input) -> GainNode (Volume) -> AudioDestinationNode (Output)
  //console.log(source);
/*
  context.decodeAudioData(arrayBuffer).then(function (decodedData) {
    // デコードしたデータをここで使う
    //console.log(decodedData);
    source.buffer = decodedData;
  });*/
  //console.log(rateRange.valueAsNumber);
  //loopToggleBox.checked
context.decodeAudioData(arrayBuffer, function (decodedData) {
  source.buffer = decodedData;
});
  source.connect(gain);
  gain.connect(context.destination);

  // Start audio
  source.start(0);
  //context.decodeAudioData(arrayBuffer, successCallback, errorCallback);
}

const startAudio = function(arrayBuffer) {
  source = context.createBufferSource();
  context.decodeAudioData(arrayBuffer, function (decodedData) {
    source.buffer = decodedData;
  });
  source.connect(gain);
  gain.connect(context.destination);

  // Start audio
  source.start(0);
  
};

async function eventTargetFile(uri) {
  const res = await fetch(uri);
  // xxx: error Handling
  const data = await res.blob().then((blob) => ({
    contentType: res.headers.get('Content-Type'),
    blob: blob,
  }));
  // xxx: error Handling
  return new File([data.blob], uri, { type: data.contentType });
}

async function LoadBuffer(actx, buffer) {
  return actx.decodeAudioData(buffer);
}

/* Events */
const eventWrap = new EventWrapper();

fileUploadAudioButton.addEventListener(eventWrap.click, async function (event) {
  const uploader = this;
  uploader.disabled = true;
  uploader.textContent = 'Now Loading...';
  const progressArea = selectAudioName;
  const file = await eventTargetFile(soundPath);
  // xxx: error Handling
  const reader = new FileReader();
  reader.onprogress = (event) => {
    // xxx: `fetch` の時点で、もう取得終えてる？
    if (event.lengthComputable && event.total > 0) {
      const rate = Math.floor((event.loaded / event.total) * 100);
      progressArea.textContent = `${rate} %`;
    }
  };
  // xxx: error Handling
  // Success read
  reader.onload = () => {
    const arrayBuffer = reader.result;
    startAudio(arrayBuffer);
    progressArea.textContent = file.name;
    uploader.textContent = 'Complete !!';
  };
  // Read the instance of File
  reader.readAsArrayBuffer(file);
});

/*
document.addEventListener('DOMContentLoaded', async () => {
  source = context.createBufferSource();
  const audioBuffer = await LoadSample(context, soundPath);
  source.buffer = audioBuffer;
});
*/
// Toggle loop
loopToggleBox.addEventListener(eventWrap.CLICK, function () {
  if (source instanceof AudioBufferSourceNode) {
    source.loop = this.checked;
  }
});
