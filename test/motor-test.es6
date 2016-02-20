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

  it('immediately emits a tick upon start', function (done) {
    m.addListener('tick', function () {
      done();
    });
    m.start();
    m.stop();
  });
});
