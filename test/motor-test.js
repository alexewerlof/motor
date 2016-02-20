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
    console.dir(_motor2.default);
    m = new _motor2.default();
  });

  it('can be instantiated', function () {
    expect(m).to.be.an('object');
  });
});