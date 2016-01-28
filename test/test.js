/* eslint-disable no-magic-numbers, no-undef, no-unused-vars */

const should = require('chai').should();
const foo = 'bar';
const beverages = { tea: ['chai', 'matcha', 'oolong'] };

describe('foo', () => {
  it('should be a string, equal "bar" and be 3 letters long', () => {
    foo.should.be.a('string');
    foo.should.equal('bar');
    foo.should.have.length(3);
  });
});

describe('beverages', () => {
  it('should have 3 values in a lovely tea property', () => {
    beverages.should.have.property('tea').with.length(3);
  });
});
