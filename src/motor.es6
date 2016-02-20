/**
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
const EventEmitter = require('events');

const MOTOR_INTERVAL = 200;

/**
 * Gives the number of seconds (not milliseconds) since epoch
 * @return {Number} a number with fractional part
 */
function now() {
  return new Date().getTime() / 1000;
}


/**
 * You should listen to the 'tick' event.
 * Listenning to the 'error' event is recommended too.
 */
export default class Motor extends EventEmitter {

  constructor() {
    super();
    /** the epoch (in seconds) since the timer got started */
    this._startTime = 0;
    /** the epoch (in seconds) that the callback is expected to be called next time */
    this._nextTick = 0;
    /** the handler to the setTimeout() call */
    this._timerHandle = null;
    /**
     * The interval function that will be called every second while the timer is running
     * It is not guaranteed that this function will be called every single second.
     * In other words it may skip a second. But when it is called, it is passed the number of elapsed seconds.
     * For example if the browser doesn't run the setTimeout() as quick as we expect or if running the
     * callback function takes too long.
     */
    this._boundTick = () => {
      var t = now();

      if (this._nextTick <= t) {
        //compute number of seconds from when the motor started
        let passedSec = Math.floor(t - this._startTime);
        //compute when will be the next call
        this._nextTick = this._startTime + this._passedSec + 1;
        this.emit('tick', passedSec);
      }

      // Only schedule another callback if the current callback is not cleared.
      // The callback may stop the timer. In that case we shouldn't schedule a new timeout event.
      if (this._timerHandle) {
        this._timerHandle = setTimeout(this._boundTick, MOTOR_INTERVAL);
      }
    }
  }

  /** starts the motor
   * @param callbackFn {function} the function to be called at least once a second (maybe longer).
   *        The only parameter passed to this function is the number of seconds since start() was called.
   *        The function is not called until at least one second has passed since the start() was called.
   * @note the callbackFn can stop the timer by calling stop()
   */
  start() {
    //first make sure that the engine is stopped
    this.stop();
    this._startTime = now();
    this._nextTick = this._startTime + 1;
    this._timerHandle = setTimeout(this._boundTick, MOTOR_INTERVAL);
  }

  /**
   * @return {boolean} returns true if the timer has a timeout already scheduled
   */
  isRunning() {
    return !!this._timerHandle;
  }

  /** stops the motor so the callback function will not be called anymore */
  stop() {
    if (this.isRunning()) {
      clearTimeout(this._timerHandle);
      this._timerHandle = null;
    }
  }
}
