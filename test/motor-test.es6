import Motor from '../src/motor.js';
import chai from 'chai'
const expect = chai.expect;

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
