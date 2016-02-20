import Motor from '../src/motor.js';
import chai from 'chai'
const expect = chai.expect;
const assert = chai.assert;
// Number of seconds that the motor can be wrong and still acceptable
const ACCEPTED_ERROR_SEC = 0.05;
const ACCEPTED_ERROR_MS = ACCEPTED_ERROR_SEC * 1000;

describe('motor', function() {
  var m;

  beforeEach(function() {
    m = new Motor();
  });

  it('can be instantiated', function() {
    expect(m).to.be.an('object');
  });

  it('its public interface is in place', function() {
    assert.isFunction(m.start, 'start()');
    assert.isFunction(m.stop, 'stop()');
    assert.isFunction(m.isRunning, 'isRunning()');
    assert.isFunction(m.addListener, 'addListener()');
    assert.isFunction(m.removeListener, 'removeListener()');
  });

  describe('isRunning()', function() {
    it('works correctly in relation with _timerHandle', function() {
      m.start();
      expect(m.isRunning()).to.be.true;
      expect(m._timerHandle).to.not.be.null;
      m.stop();
      expect(m.isRunning()).to.be.false;
      expect(m._timerHandle).to.be.null;
    });
  });

  describe('start()', function() {
    it('immediately emits a tick', function(done) {
      m.addListener('tick', function(passedSec, passedSecFloor) {
        expect(passedSec).to.be.zero;
        expect(passedSecFloor).to.be.zero;
        done();
      });
      m.start();
      m.stop();
    });

    it('emits a tick roughly one second after', function(done) {
      var startTimeStamp = Date.now();
      m.start();
      m.addListener('tick', function(passedSec, passedSecFloor) {
        var tickTimestamp = Date.now();
        expect(tickTimestamp).to.be.closeTo(startTimeStamp + 1000, ACCEPTED_ERROR_MS);
        expect(passedSec).to.be.above(1);
        expect(passedSec).to.be.closeTo(1, ACCEPTED_ERROR_SEC);
        expect(passedSecFloor).to.be.equal(1);
        m.stop();
        done();
      });
    });

    it('generates ticks with acceptable errors every second', function(done) {
      const Iterations = 10;
      var i = 0;
      // Set a deadline for how long it can take before Mocha's done() callback is called
      this.timeout(1000 * (Iterations + 1));

      var startTimestamp, lastTimestamp;

      m.addListener('tick', function(passedSec, passedSecFloor) {
        // expect(passedSecFloor).to.be.equal(Math.floor(passedSec));
        var tickTimestamp = Date.now();
        if (!lastTimestamp) {
          // Only happens the first time the handler is called (right after start).
          lastTimestamp = tickTimestamp;
          return;
        }
        i++;
        var delta = tickTimestamp - lastTimestamp;
        var passed = tickTimestamp - startTimestamp;
        var error = delta - 1000;
        lastTimestamp = tickTimestamp;
        console.log('Iteration', i, 'delta:', delta, 'ms', 'error:', error, 'ms');
        expect(error).to.be.closeTo(0, ACCEPTED_ERROR_MS);
        expect(passedSec).to.be.closeTo(passed / 1000, ACCEPTED_ERROR_SEC);
        if (i === Iterations) {
          m.stop();
          done();
        }
      });
      startTimestamp = Date.now();
      m.start();
    });
  });

});
