'use strict'

require('chai').should()

const TimeRef = require('../lib/TimeRef')

describe('live.TimeRef()', function() {
  it('should return a float', function() {
    TimeRef().should.be.a.float
  })

  it('should count time in seconds', function(done) {
    let start = TimeRef()
    setTimeout(function() {
      let diff = TimeRef() - start
      diff.should.be.above(0.095)
      diff.should.be.below(0.105)
      done()
    }, 100)
  })
})

