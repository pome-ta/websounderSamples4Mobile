export class EventWrapper {
  constructor() {
    /*
    const isMobile = /iPhone|iPad|iPod|Android/.test(navigator.userAgent);
    this._click = isMobile ? 'click':'click';
    this._start = isMobile ? 'touchstart':'mousedown';
    this._move = isMobile ? 'touchmove':'mousemove';
    this._end = isMobile ? 'touchend':'mouseup';
    */
    //this._click = '';
    //this._start = '';
    //this._move = '';
    //this._end = '';

    [this._click, this._start, this._move, this._end] =
      /iPhone|iPad|iPod|Android/.test(navigator.userAgent)
        ? ['click', 'touchstart', 'touchmove', 'touchend']
        : ['click', 'mousedown', 'mousemove', 'mouseup'];
  }

  get click() {
    return this._click;
  }

  get start() {
    return this._start;
  }

  get move() {
    return this._move;
  }

  get end() {
    return this._end;
  }
}
