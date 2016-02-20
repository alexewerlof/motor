'use strict';

var _motor = require('../src/motor.js');

var _motor2 = _interopRequireDefault(_motor);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

describe('motor', function () {
  var m;

  beforeEach(function () {
    m = new _motor2.default();
  });

  it('can be instantiated', function () {
    expect(m).to.be.an('object');
  });

  it('its public interface is in place', function () {
    expect(m.start).to.be.a('function');
    expect(m.stop).to.be.a('function');
    expect(m.isRunning).to.be.a('function');
    expect(m.on).to.be.a('function');
    expect(m.off).to.be.a('function');
  });

  describe('isRunning()', function () {
    it('works correctly in relation with _timerHandle', function () {
      m.start();
      expect(m.isRunning()).to.be.true;
      expect(m._timerHandle).to.not.be.null;
      m.stop();
      expect(m.isRunning()).to.be.false;
      expect(m._timerHandle).to.be.null;
    });
  });
});