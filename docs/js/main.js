'use strict';

/* util funcs */
function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getDecimalPointDigits(valueStr) {
  const numbers = valueStr.split('.');
  const pointLen = numbers[1] ? numbers[1].length : 0;
  // xxx: 0 で、返したものを1 で返してる
  return pointLen ? pointLen : 1;
}

function parseValueNum({ value, numtype = 'float' }) {
  return numtype === 'int'
    ? Number.parseInt(value)
    : Number.parseFloat(value).toFixed(getDecimalPointDigits(value));
}

/* create document node element funcs */
function createButton(idName, textContent = null) {
  const element = document.createElement('button');
  element.style.width = '100%';
  element.style.height = '4rem';
  element.type = 'button';
  element.id = idName;
  element.textContent = textContent;
  return element;
}

function createInputRange({ id, min, max, value, numtype, step = 1 }) {
  const element = document.createElement('input');
  element.type = 'range';
  element.id = id;
  element.min = min;
  element.max = max;
  element.step = step;
  element.value = value;
  element.numtype = numtype;
  element.style.width = '100%';
  element.style.height = '2rem';
  element.style.margin = 0;
  return element;
}

function setAppendChild(nodes, parentNode = document.body) {
  let preNode = parentNode;
  nodes.forEach((node) => {
    Array.isArray(node)
      ? setAppendChild(node, preNode)
      : parentNode.appendChild(node);
    preNode = node;
  });
}

/* setup document node element */
const mainTitleHeader = document.createElement('h1');
mainTitleHeader.textContent = 'GainNode';

const buttonWrap = document.createElement('div');
buttonWrap.style.width = '100%';
const labelValues = ['Play', 'Pause'];
const captionPlayPause = document.createTextNode(labelValues.join(' / '));
const soundButton = createButton('sound', labelValues[0]);

const sliderWrap = document.createElement('div');
sliderWrap.style.width = '100%';
const captionSlider = document.createTextNode('volume: ');

const sliderDiv = document.createElement('div');
sliderDiv.style.width = '88%';
sliderDiv.style.margin = 'auto';

const sliderRange = createInputRange({
  id: 'range-volume',
  min: 0.0,
  max: 1.0,
  step: 0.05,
  value: 1.0,
  numtype: 'float',
});

const sliderValue = document.createElement('span');
sliderValue.textContent = parseValueNum(sliderRange);

setAppendChild([
  mainTitleHeader,
  buttonWrap,
  [captionPlayPause, soundButton],
  sliderWrap,
  [captionSlider, sliderValue],
  sliderDiv,
  [sliderRange],
]);

// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan:
    typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved:
    typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded:
    typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

/* audio */
// xxx: prefix は無し
const context = new AudioContext();
//const oscillator = context.createOscillator();
let oscillator;
const gain = context.createGain();

function tapAction() {
  // xxx: [0, 1] の繰り返しなので、ビット排他的理論和処理。無駄に
  const isPlayFlag = labelValues.indexOf(this.textContent) ^ 1;

  if (isPlayFlag) {
    oscillator = context.createOscillator();
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(0);
  } else {
    oscillator.stop(0);
  }

  this.textContent = labelValues[isPlayFlag];
}

gain.connect(context.destination);
gain.gain.value = 0.5; // Set volume at 0.5

soundButton.addEventListener(touchBegan, tapAction);
sliderRange.addEventListener('input', () => {
  sliderValue.textContent = parseValueNum(sliderRange);
});
