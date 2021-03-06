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

let isPlaying = 0;

/* setup document node element */
const switchPlayPause = ['Play', 'Pause'];
const waveTypes = ['sine', 'square', 'sawtooth', 'triangle'];
let playPauseButton;
let volumeRangeValue, volumeRange;
let typeSelect;
let frequencyRangeValue, frequencyRange;
let detuneRangeValue, detuneRange;

const setupDOM = () => {
  const mainTitleHeader = document.createElement('h1');
  mainTitleHeader.textContent = 'OscillatorNode | サウンドの生成';
  mainTitleHeader.style.fontSize = '1rem';

  /* main controller */
  const setupMainController = () => {
    // START / PAUSE
    let playPauseSection;
    const captionPlayPause = document.createTextNode(
      switchPlayPause.join(' / ')
    );
    playPauseButton = createButton('sound', switchPlayPause[isPlaying]);
    playPauseButton.style.width = '100%';
    playPauseSection = setAppendChild(
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

    // WAVE TYPE
    let waveTypeSection;
    const waveTypeCaption = document.createTextNode('WAVE TYPE');
    const waveTypeWrap = document.createElement('div');
    waveTypeWrap.style.width = '88%';
    waveTypeWrap.style.margin = 'auto';
    typeSelect = createSelectOpitons({
      id: 'form-wave-type',
      options: waveTypes,
    });
    waveTypeSection = setAppendChild(
      [waveTypeCaption, waveTypeWrap, [typeSelect]],
      createSection()
    );

    // FREQUENCY
    let frequencyRangeSection;
    frequencyRange = createInputRange({
      id: 'range-frequency',
      min: 20,
      max: 8000,
      value: 440,
      numtype: 'int',
    });
    [frequencyRangeSection, frequencyRangeValue] =
      setupRangeToSectionInputValue(frequencyRange, 'FREQUENCY : ', ' Hz');

    // DETUNE
    let detuneRangeSection;
    detuneRange = createInputRange({
      id: 'range-detune',
      min: -100,
      max: 100,
      value: 0,
      numtype: 'int',
    });
    [detuneRangeSection, detuneRangeValue] = setupRangeToSectionInputValue(
      detuneRange,
      'DETUNE : ',
      ' cent'
    );

    return [
      playPauseSection,
      volumeRangeSection,
      waveTypeSection,
      frequencyRangeSection,
      detuneRangeSection,
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

const context = new AudioContext();

// Create the instance of OscillatorNode
let oscillator = context.createOscillator();
const frequencyMin = oscillator.frequency.minValue || 0;
const frequencyMax = oscillator.frequency.maxValue || 100000;
const detuneMin = oscillator.detune.minValue || -4800;
const detuneMax = oscillator.detune.maxValue || 4800;

// Create the instance of GainNode
const gain = context.createGain();
const gainMin = gain.gain.minValue || 0;
const gainMax = gain.gain.maxValue || 1;

function updateControllers() {
  // xxx: 複数同時に、再描画・処理されるから無駄が多い？
  oscillator.type = typeSelect.value;

  if (
    volumeRange.valueAsNumber >= gainMin &&
    volumeRange.valueAsNumber <= gainMax
  ) {
    gain.gain.value = volumeRange.valueAsNumber;
    volumeRangeValue.textContent = parseValueNum(volumeRange);
  }

  if (
    frequencyRange.valueAsNumber >= frequencyMin &&
    frequencyRange.valueAsNumber <= frequencyMax
  ) {
    oscillator.frequency.value = frequencyRange.valueAsNumber;
    frequencyRangeValue.textContent = parseValueNum(frequencyRange);
  }
  if (
    detuneRange.valueAsNumber >= detuneMin &&
    detuneRange.valueAsNumber <= detuneMax
  ) {
    oscillator.detune.value = detuneRange.valueAsNumber;
    detuneRangeValue.textContent = parseValueNum(detuneRange);
  }
}

/*
 * Events
 */
const eventWrap = new EventWrapper();

playPauseButton.addEventListener(eventWrap.start, () => {
  isPlaying = isPlaying ^ 1;
  if (isPlaying) {
    oscillator = context.createOscillator();
    oscillator.connect(gain).connect(context.destination);
    //gain.connect(context.destination);
    updateControllers();
    oscillator.start(0);
  } else {
    oscillator.stop(0);
  }
  playPauseButton.textContent = switchPlayPause[isPlaying];
});

typeSelect.addEventListener('change', updateControllers);

[volumeRange, frequencyRange, detuneRange].forEach((slider) =>
  slider.addEventListener('input', updateControllers)
);

document.addEventListener('DOMContentLoaded', updateControllers);
