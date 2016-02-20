import Motor from '../src/motor.js';
import chai from 'chai'
const expect = chai.expect;
const assert = chai.assert;

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
      m.addListener('tick', function (passedSec, passedSecFloor) {
        var tickTimeStamp = Date.now();
        expect(tickTimeStamp).to.be.closeTo(startTimeStamp + 1000, 200);
        expect(passedSec).to.be.above(1);
        expect(passedSec).to.be.closeTo(1, 0.2);
        expect(passedSecFloor).to.be.equal(1);
        done();
      });
    });
  });
});
