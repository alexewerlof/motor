'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This is the motoric part of the timer.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * It encapsulates all the routines that control starting, pausing, restarting and stopping the timer with
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * highest possible precision.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * It is built to last and tolerate things like browser crash, restart, shutdown or even daylight saving time shifts.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * It is atomic, modular and well tested.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This is a state of the art code that is the heart of the product.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Logic:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * There is a _tick() function that will be called as quickly as possible (not quicker than MOTOR_INTERVAL).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * This function checks if at least one second has been passed since start() was called or the callback was called last time.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * If this is the case the callback will be called passing the number of seconds since start() was called.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Essentially this motor eliminates two problems:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 1. If the browser doesn't call setTimeout() as quick as we expect, the timer will not be delayed for it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * 2. If the computer for any reason gets too busy executing the callback function, another call will not initiate
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *    until the previous execution of callback is finished.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var MOTOR_INTERVAL = 200;

/**
 * Gives the number of seconds (not milliseconds) since epoch
 * @return {Number} a number with fractional part
 */
function timeStampSec() {
  return Date.now() / 1000;
}

/**
 * You should listen to the 'tick' event.
 * Listenning to the 'error' event is recommended too.
 */

var Motor = function (_EventEmitter) {
  _inherits(Motor, _EventEmitter);

  function Motor() {
    _classCallCheck(this, Motor);

    /** the epoch (in seconds) since the timer got started */

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Motor).call(this));

    _this._startTime = 0;
    /** the epoch (in seconds) that the callback is expected to be called next time */
    _this._nextTick = 0;
    /** the handler to the setTimeout() call */
    _this._timerHandle = null;
    /**
     * The interval function that will be called every second while the timer is running
     * It is not guaranteed that this function will be called every single second.
     * In other words it may skip a second. But when it is called, it is passed the number of elapsed seconds.
     * For example if the browser doesn't run the setTimeout() as quick as we expect or if running the
     * callback function takes too long.
     */
    _this._tick = function () {
      var tickTimeStamp = timeStampSec();

      if (_this._nextTick <= tickTimeStamp) {
        //compute number of seconds from when the motor started
        var passedSec = tickTimeStamp - _this._startTime;
        var passedSecFloor = Math.floor(passedSec);
        //compute when will be the next call
        _this._nextTick = _this._startTime + passedSecFloor + 1;
        _this.emit('tick', passedSec, passedSecFloor);
      }

      // Only schedule another callback if the current callback is not cleared.
      // The callback may stop the timer. In that case we shouldn't schedule a new timeout event.
      if (_this._timerHandle) {
        _this._timerHandle = setTimeout(_this._tick, MOTOR_INTERVAL);
      }
    };
    return _this;
  }

  /** starts the motor
   * @param callbackFn {function} the function to be called at least once a second (maybe longer).
   *        The only parameter passed to this function is the number of seconds since start() was called.
   *        The function is not called until at least one second has passed since the start() was called.
   * @note the callbackFn can stop the timer by calling stop()
   */


  _createClass(Motor, [{
    key: 'start',
    value: function start() {
      //first make sure that the engine is stopped
      this.stop();
      this._startTime = timeStampSec();
      this._nextTick = this._startTime + 1;
      this.emit('tick', 0);
      this._timerHandle = setTimeout(this._tick, MOTOR_INTERVAL);
    }

    /**
     * @return {boolean} returns true if the timer has a timeout already scheduled
     */

  }, {
    key: 'isRunning',
    value: function isRunning() {
      return !!this._timerHandle;
    }

    /** stops the motor so the callback function will not be called anymore */

  }, {
    key: 'stop',
    value: function stop() {
      if (this.isRunning()) {
        clearTimeout(this._timerHandle);
        this._timerHandle = null;
      }
    }
  }]);

  return Motor;
}(_events2.default);

exports.default = Motor;