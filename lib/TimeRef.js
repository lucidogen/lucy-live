/*
  # TimeRef

  Time reference in seconds since application start.
*/
'use strict'

const now = function() {
  return Date.now() / 1000
}

const ref = now()

module.exports = function() {
  return now() - ref
}
