'use strict';


(function() {
  let onDOMContentLoaded = function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    try {
      // Create the instance of AudioContext
      let context = new AudioContext();
        } catch (error) {
            window.alert(error.message + ' : Please use Chrome or Safari.');
            return;
        }
 
        var displayProperties = function(node, tableid, caption) {
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
            document.getElementById(tableid).parentNode.previousElementSibling.style.display = 'block';
        };
 
        // for the instance of OscillatorNode
        var oscillator = null;
 
        // Flag for starting or stopping sound
        var isStop = true;
 
        /*
         * Event Listener
         */
 
        // Start or Stop sound
        document.querySelector('button').addEventListener(EventWrapper.CLICK, function() {
            if (isStop) {
                // Create the instance of OscillatorNode
                oscillator = context.createOscillator();
 
                // for legacy browsers
                oscillator.start = oscillator.start || oscillator.noteOn;
                oscillator.stop  = oscillator.stop  || oscillator.noteOff;
 
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
 
                prototypes.OscillatorNode  = Object.getPrototypeOf(oscillator);                  // OscillatorNode instance -> OscillatorNode
                prototypes.AudioSourceNode = Object.getPrototypeOf(prototypes.OscillatorNode);   // OscillatorNode  -> AudioSourceNode
                prototypes.AudioNode       = Object.getPrototypeOf(prototypes.AudioSourceNode);  // AudioSourceNode -> AudioNode
 
                displayProperties(context.destination,       'audiodestinationnode-properties', 'AudioDestinationNode');
                displayProperties(oscillator,                'oscillatornode-properties',       'OscillatorNode');
                // displayProperties(prototypes.AudioNode,      'audionode-properties',            'AudioNode');
            } else {
                // Stop sound
                oscillator.stop(0);
 
                isStop = true;
                this.innerHTML = '<span class="icon-start"></span>';
            }
        }, false);
    };
 
    if ((document.readyState === 'interactive') || (document.readyState === 'complete')) {
        onDOMContentLoaded();
    } else {
        document.addEventListener('DOMContentLoaded', onDOMContentLoaded, true);
    }
 
})();
