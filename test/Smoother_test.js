'use strict'

require('chai').should()

const Smoother = require('../lib/Smoother')

console.log('Smoother_test.js')

describe('live.Smoother', function() {

  describe('#new', function() {
    it('should return an instance of Smoother', function() {
      let s = new Smoother()
      s.should.be.an.instanceof(Smoother)
      s.value().should.equal(0.0)
    })
  })

  describe('#setValue', function() {
    it('should set current value immediately', function() {
      let s = new Smoother()
      s.setValue(1.23)
      s.value().should.equal(1.23)
    })
  })

  describe('smoothing', function() {
    it('should smooth values', function() {
      let s = new Smoother()
      s.value().should.equal(0.0)
      // set first value
      s.setValue(1.0, 10)
      // value after 1.0 s
      s.value(11).should.equal(1.0)
      // no change with time
      s.value(13).should.equal(1.0)
      // set second value at time 20
      s.setValue(2.0, 20)
      s.speed.should.equal(0.1)
      s.svalue.should.equal(2.0)
      s.svalue_ref.should.equal(20)

      // Changes with time
      s.value(22).should.equal(2.2)
      s.setValue(2.5, 30)
      // Speed change
      s.speed.should.equal(0.05)
    })
  })
})

