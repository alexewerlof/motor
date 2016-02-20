import Motor from '../src/motor.js';
import chai from 'chai'
const expect = chai.expect;

describe('motor', function() {
  var m;

  beforeEach(function() {
    m = new Motor();
  });

  it('can be instantiated', function() {
    expect(m).to.be.an('object');
  });

  it('its public interface is in place', function() {
    expect(m.start).to.be.a('function');
    expect(m.stop).to.be.a('function');
    expect(m.isRunning).to.be.a('function');
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
});
