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

export function parseValueNum({ value, step, numtype = 'float' }) {
  return numtype === 'int'
    ? Number.parseInt(value)
    : Number.parseFloat(value).toFixed(getDecimalPointDigits(step));
}

/* create document node element funcs */
export function createButton(idName, textContent = null) {
  const element = document.createElement('button');
  element.style.width = '100%';
  element.style.height = '4rem';
  element.type = 'button';
  element.id = idName;
  element.textContent = textContent;
  return element;
}

export function createInputRange({ id, min, max, value, numtype, step = 1 }) {
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

export function createCheckbox({ id, checked = false }) {
  const element = document.createElement('input');
  element.type = 'checkbox';
  element.id = id;
  element.checked = checked;
  element.style.cursor = 'pointer';
  element.style.width = '1rem';
  element.style.height = '1rem';
  /*element.style.padding = '0 1rem';*/
  return element;
}

export function setAppendChild(nodes, parentNode = document.body) {
  let preNode = parentNode;
  nodes.forEach((node) => {
    Array.isArray(node)
      ? setAppendChild(node, preNode)
      : parentNode.appendChild(node);
    preNode = node;
  });
}
