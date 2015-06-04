/*
  # Smoother

  Transform a discrete progression into a continous (time
  based) value.

  The discrete count value can jump back or forward. When a
  jump (speed change larger then 2x) occurs, we do not update
  speed immediately: we wait for progression to stabilize (have
  at least two steps with speed changes under 2x.

*/
'use strict'
const TimeRef = require('./TimeRef')
  
// Return the current beat value
const getValue = function(time_ref) {
  if (this.stopped) return this.svalue
  time_ref = time_ref || TimeRef()
  return this.svalue + (time_ref - this.svalue_ref) * this.speed
}

// This method is called by the discrete counter to set current value. Optional
// `time_ref` can be used to set current time reference. Default is
// TimeRef().
const setValue = function(value, time_ref) {
  time_ref = time_ref || TimeRef()
  // Current speed is the last changed speed (not used for continuous value
  // computation or the real speed).
  let current_speed = this.changed_speed || this.speed
  // Compute new speed.
  let dt = time_ref - this.svalue_ref
  let new_speed = (value - this.svalue) / dt
  if (new_speed > 2 * current_speed ||
     new_speed < current_speed / 2) {
    // Too much change: do not update speed.
    this.changed_speed = new_speed
  } else {
    // Update current speed
    this.changed_speed = null
    this.speed = new_speed
  }
  // Store discrete value and time ref
  this.svalue = value
  this.svalue_ref = time_ref
}

const setFirstValue = function(value, time_ref) {
  this.svalue = value
  this.svalue_ref = time_ref || TimeRef()
  this.setValue = setSecondValue
}

const setSecondValue = function(value, time_ref) {
  time_ref = time_ref || TimeRef()
  let dt = time_ref - this.svalue_ref 
  this.speed = (value - this.svalue) / dt
  this.svalue = value
  this.svalue_ref = time_ref
  this.setValue = setValue
  this.value = getValue
}

const getFirstValues = function() {
  return this.svalue
}

const Smoother = function() {
  // Discrete value
  this.svalue      = 0
  // Time at which last discrete svalue was set
  this.svalue_ref  = 0
  // Current discrete value progression speed
  this.speed       = null
  // Store last speed change in case it is too large to
  // directly change 'speed'.
  this.changed_speed = null
  // Start stopped so that we just return 0 on value query
  // before speed and value are first set.
  this.stopped = null
  
  this.setValue = setFirstValue
  this.value    = getFirstValues
}

module.exports = Smoother

// Move value forward `dv`.
Smoother.prototype.addValue = function(dv, time_ref) {
  this.setValue(this.svalue + dv, time_ref)
}

// Stop advancing value with time.
Smoother.prototype.stop = function() {
  this.stopped = true
}

// Start advancing value with time again. Mark current time as equal to current
// value.
Smoother.prototype.start = function(time_ref) {
  this.stopped = false
  this.svalue_ref = time_ref || TimeRef()
}
