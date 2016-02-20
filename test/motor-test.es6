const Motor = require('../src/motor.js').default;
const expect = require('chai').expect;

describe('motor', function () {
  var m;

  beforeEach(function () {
    console.dir(Motor)
    m = new Motor();
  });

  it('can be instantiated', function () {
    expect(m).to.be.an('object');
  });
});
