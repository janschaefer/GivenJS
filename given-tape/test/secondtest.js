'use strict'

var tape = require('tape')
var t = require('../index.js')(tape)

t.test('This is a second test', function (t) {
})

t.finished()

