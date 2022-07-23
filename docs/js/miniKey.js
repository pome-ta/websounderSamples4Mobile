export class MiniKey {
  baseSettings = {
    width: 480,
    height: 160,
    // xxx: いらないかも
    margin: 'auto',

    start: 'A3',
    startNote: 'A',
    startOctave: 3,
    keyOctave: 2,

    whiteKeyColor: '#fffff8',
    blackKeyColor: '#232323',
    borderColor: 'lightgray',
    activeColor: 'maroon',
  };
  noteNumber = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B',
  ];
  scaleNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  scaleSharps = ['C', 'D', 'F', 'G', 'A'];

  constructor(element, user_settings = {}) {
    this.init(element, user_settings);
  }

  init(element, user_settings) {
    this.settings = this.initSettings(element, user_settings);
    this.totalWhiteLength = this.settings.keyOctave * this.scaleNotes.length;
    this.keyboard = this.createKeyboard(element);

    this.keyDown = () => {};
    this.keyUp = () => {};
    this.addListeners(element);
  }

  initSettings(element, user_settings) {
    this.baseSettings.width = element.offsetWidth;
    this.baseSettings.height = element.offsetHeight;
    const [baseStartNote, baseStartOctave] =
      this.baseSettings.start.split(/(?=\d)/g);
    this.baseSettings.startNote = baseStartNote;
    this.baseSettings.startOctave = parseInt(baseStartOctave);

    // `start` の値が強い（`startNote`, `startOctave` よりも）
    const [startNote, startOctave] = user_settings.start
      ? user_settings.start.split(/[#]|(?=\d)/g) // 負の数値には対応していない
      : ['A', '3'];
    user_settings.startNote = startNote;
    user_settings.startOctave = parseInt(startOctave);

    return { ...this.baseSettings, ...user_settings };
  }

  createKeyboard(container) {
    const keyboard = {
      container: container,
      el: document.createElement('ul'),
      whiteNotes: this.orderNotes(this.scaleNotes),
      notesWithSharps: this.scaleSharps,
    };
    const { keys, totalWhiteLength } = this.createKeys(keyboard);
    keyboard.keys = keys;
    keyboard.totalWhiteLength = totalWhiteLength;

    // xxx: キー入力は一旦抜き
    // setKeyPressOffset(keyboard.whiteNotes);
    this.styleKeyboard(keyboard);
    this.addKeysToKeyboard(keyboard);

    keyboard.container.appendChild(keyboard.el);
    return keyboard;
  }

  /**
   * Order notes into order defined by starting key in settings.
   * @param {array} notesToOrder Notes to be ordered.
   * @return {array} orderedNotes Ordered notes.
   */
  orderNotes(notesToOrder) {
    const keyOffset = notesToOrder.indexOf(this.settings.startNote);
    const orderedNotes = notesToOrder.map(
      (_, index) =>
        notesToOrder[
          index + keyOffset < notesToOrder.length
            ? index + keyOffset
            : index + keyOffset - notesToOrder.length
        ]
    );
    return orderedNotes;
  }

  createKeys(keyboard) {
    const totalWhiteKeys = [...new Array(this.totalWhiteLength)].map(
      (_, index) => keyboard.whiteNotes[index % this.scaleNotes.length]
    );
    const keyWidth = this.getWhiteKeyWidth(this.totalWhiteLength);

    let octave = this.settings.startOctave;
    const keys = totalWhiteKeys.map((noteChar, noteIndex) => {
      octave += noteChar === 'C' && noteIndex ? 1 : 0;

      let whiteKey, blackKey;
      whiteKey = this.createKey({
        color: 'white',
        octave: octave,
        note: noteChar,
        width: keyWidth,
        id: `${noteChar}${octave}`,
        noteIndex: noteIndex,
      });
      if (
        noteIndex !== this.totalWhiteLength - 1 &&
        keyboard.notesWithSharps.includes(noteChar)
      ) {
        blackKey = this.createKey({
          color: 'black',
          octave: octave,
          note: `${noteChar}#`,
          width: keyWidth / 2,
          id: `${noteChar}#${octave}`,
          noteIndex: noteIndex,
        });
      }
      // return [whiteKey.el, blackKey ? blackKey.el : null].filter((el) => el);
      return [whiteKey, blackKey ? blackKey : null].filter((key) => key);
    });

    return {
      keys: keys.flat(),
      totalWhiteLength: this.totalWhiteLength,
    };
  }

  /**
   * Calculate width of white key.
   * @return {number} Width of a single white key in pixels.
   */
  getWhiteKeyWidth(numberOfWhiteKeys) {
    return this.settings.width / numberOfWhiteKeys;
  }

  /**
   * Create key DOM element.
   * @return {object} Key DOM element.
   */
  createKey(key) {
    key.el = document.createElement('li');
    key.el.id = key.id;
    key.el.title = key.id;
    key.el.classList.add('pianoKeys');
    key.el.setAttribute('data-note-type', key.color);
    
    key.frequency = this.getFrequency(key.note, key.octave);
    key.osc = null;
    this.styleKey(key);

    return key;
  }

  /**
   * Add styling to individual key on keyboard.
   * @param  {object} key Element of key.
   */
  styleKey(key) {
    key.el.style.display = 'inline-block';
    key.el.style['-webkit-user-select'] = 'none';
    key.el.style.boxSizing = 'border-box';
    key.el.style.border = `1px solid ${this.settings.borderColor}`;

    key.color === 'white' ? this.styleWhiteKey(key) : this.styleBlackKey(key);
  }

  /**
   * Add styling to individual white key.
   * @param  {element} el White key DOM element.
   */
  styleWhiteKey(key) {
    key.el.style.backgroundColor = this.settings.whiteKeyColor;
    key.el.style.height = `${this.settings.height}px`;
    key.el.style.width = `${key.width}px`;
    key.el.style.borderRadius = '0 0 0.5rem 0.5rem';
    key.el.style.position = 'relative';
    key.el.style.zIndex = '1';
  }

  /**
   * Add styling to individual black key.
   * @param  {element} el Black key DOM element.
   */
  styleBlackKey(key) {
    const whiteKeyWidth = this.getWhiteKeyWidth(this.totalWhiteLength);
    const clientLeft = whiteKeyWidth * key.noteIndex + 1 + whiteKeyWidth;
    const offsetLeft = key.width / 2 + 1;

    key.el.style.backgroundColor = this.settings.blackKeyColor;
    key.el.style.position = 'absolute';

    key.el.style.left = `${clientLeft - offsetLeft}px`;

    key.el.style.width = `${key.width}px`;
    key.el.style.height = `${this.settings.height / 1.5}px`;
    key.el.style.borderRadius = '0 0 0.5rem 0.5rem';
    key.el.style.zIndex = '2';
  }

  /**
   * Reset styles on keyboard container and list element.
   * @param {element} keyboard Keyboard container DOM element.
   */
  styleKeyboard(keyboard) {
    const styleElement = (el) => {
      el.style.cursor = 'default';
      // el.style.fontSize = '0px';
      el.style.height = `${this.settings.height}px`;
      el.style.padding = 0;
      el.style.position = 'relative';
      el.style.listStyle = 'none';
      el.style.margin = this.settings.margin;
      el.style['-webkit-user-select'] = 'none';
      el.style.boxSizing = 'border-box';
    };

    styleElement(keyboard.container);
    styleElement(keyboard.el);
    const elWidth =
      keyboard.totalWhiteLength *
      this.getWhiteKeyWidth(keyboard.totalWhiteLength);
    keyboard.el.style.width = `${elWidth}px`;
  }

  addKeysToKeyboard(keyboard) {
    keyboard.keys.forEach((key) => keyboard.el.appendChild(key.el));
  }
  /**
   * Add event listeners to keyboard.
   * @param {element} keyboardElement
   */
  addListeners(keyboardElement) {
    keyboardElement.addEventListener('touchmove', (event) => {
      event.preventDefault();
    });
    // keyboardElement.querySelectorAll('.pianoKeys').forEach((key) => {
    this.keyboard.keys.forEach((key) => {
      key.el.addEventListener('pointerdown', (event) => {
        key.el.releasePointerCapture(event.pointerId);
      });

      key.el.addEventListener('pointerenter', (event) => {
        this.eventDown(event, key, this.keyDown);
      });

      key.el.addEventListener('pointerleave', (event) => {
        this.eventUp(event, key, this.keyUp);
      });
    });
  }

  /**
   * Call user's Down event.
   */
  eventDown(event, key, callback) {
    this.setActiveColor(event.target);
    // this.setActiveColor(key.el);
    callback(key);
  }

  /**
   * Call user's Up event.
   */
  eventUp(event, key, callback) {
    this.revertActiveColor(event.target);
    callback(key);
  }

  /**
   * Lighten up man. Change the color of a key.
   * @param  {element} el DOM element to change color of.
   */
  setActiveColor(el) {
    // xxx: `if (el !== null || typeof el === undefined)` いる？
    el.style.backgroundColor = this.settings.activeColor;
  }

  /**
   * Revert key to original colour.
   * @param  {element} el DOM element to change colour of.
   */
  revertActiveColor(el) {
    // xxx: `if (el !== null)` いる？
    el.style.backgroundColor =
      el.getAttribute('data-note-type') === 'white'
        ? this.settings.whiteKeyColor
        : this.settings.blackKeyColor;
  }

  getMidiNote(note, octave) {
    const tone = this.noteNumber.indexOf(note);
    // C-1 = 0
    const midiOctave = octave + 1;
    return midiOctave * 12 + tone;
  }

  getFrequency(note, octave) {
    const midiNote = this.getMidiNote(note, octave);
    // A4 = 69 = 440.0Hz
    return 440.0 * Math.pow(2.0, (midiNote - 69) / 12);
  }
}
