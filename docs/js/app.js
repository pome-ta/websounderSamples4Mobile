//'use strict';
function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function createButton(idName, textContent = null) {
  const element = document.createElement('button');
  element.style.width = '50%';
  element.style.height = '4rem';
  element.type = 'button';
  element.id = idName;
  element.textContent = textContent ? textContent : capitalize(idName);
  return element;
}

// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan:
    typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved:
    typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded:
    typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};




(function () {
  let onDOMContentLoaded = function () {
  const playButton = createButton('play');


document.body.appendChild(playButton);
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    try {
      // Create the instance of AudioContext
      var context = new AudioContext();
    } catch (error) {
      window.alert(error.message + ' : Please use Chrome or Safari.');
      return;
    }

    var displayProperties = function (node, tableid, caption) {
      var html = '<caption>' + caption + '</caption>';

      html += '<thead>';
      html += '<tr>';
      html += '<th scope="col">Property</th>';
      html += '<th scope="col">Value</th>';
      html += '<th scope="col">hasOwnProperty</th>';
      html += '</tr>';
      html += '</thead>';

      html += '<tbody>';

      for (var key in node) {
        html += '<tr>';
        html += '<td>' + key + '</td>';
        html += '<td>' + node[key] + '</td>';
        html += '<td>' + node.hasOwnProperty(key) + '</td>';
        html += '</tr>';
      }

      html += '</tbody>';

      document.getElementById(tableid).innerHTML = html;
      document.getElementById(
        tableid
      ).parentNode.previousElementSibling.style.display = 'block';
    };

    // for the instance of OscillatorNode
    var oscillator = null;

    // Flag for starting or stopping sound
    var isStop = true;

    /*
     * Event Listener
     */

    // Start or Stop sound
    document.querySelector('button').addEventListener(
      //EventWrapper.CLICK,
      touchBegan,
      function () {
      console.log(this);
        if (isStop) {
          // Create the instance of OscillatorNode
          oscillator = context.createOscillator();

          // for legacy browsers
          oscillator.start = oscillator.start || oscillator.noteOn;
          oscillator.stop = oscillator.stop || oscillator.noteOff;

          // OscillatorNode (Input) -> AudioDestinationNode (Output)
          oscillator.connect(context.destination);

          // Start sound
          oscillator.start(0);

          isStop = false;
          this.innerHTML = '<span class="icon-pause"></span>';

          /*
           * Display properties
           */

          // Prototype chain
          var prototypes = {};

          prototypes.OscillatorNode = Object.getPrototypeOf(oscillator); // OscillatorNode instance -> OscillatorNode
          prototypes.AudioSourceNode = Object.getPrototypeOf(
            prototypes.OscillatorNode
          ); // OscillatorNode  -> AudioSourceNode
          prototypes.AudioNode = Object.getPrototypeOf(
            prototypes.AudioSourceNode
          ); // AudioSourceNode -> AudioNode

          displayProperties(
            context.destination,
            'audiodestinationnode-properties',
            'AudioDestinationNode'
          );
          displayProperties(
            oscillator,
            'oscillatornode-properties',
            'OscillatorNode'
          );
          // displayProperties(prototypes.AudioNode,      'audionode-properties',            'AudioNode');
        } else {
          // Stop sound
          oscillator.stop(0);

          isStop = true;
          this.innerHTML = '<span class="icon-start"></span>';
        }
      },
      false
    );
  };

  if (
    document.readyState === 'interactive' ||
    document.readyState === 'complete'
  ) {
    onDOMContentLoaded();
  } else {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded, true);
  }
})();
