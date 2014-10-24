var domready = require('domready')
var tapBrowserColor = require('tap-browser-color')
var test = require('tape').test

var allTests = []

function addTest(description, fn) {
	allTests.push({
		description: description,
		fn: fn
	})
}

var queuedUp = []

var testIsRunning = false
var domIsReady = false
var tapStarted = false
function startIfNecessary() {
	if (!testIsRunning && domIsReady && tapStarted) {
		testIsRunning = true
		runNext()
	}
}

function runNext() {
	var next = queuedUp.shift()
	if (next) {
		next()
	} else {
		testIsRunning = false
	}
}

function start() {
	allTests.forEach(function(next) {
		console.log('prepping', next.description)
		test(next.description, function(t) {
			tapStarted = true
			console.log('inside test function', next.description)
			queuedUp.push(function() {
				console.log('running queued up test')
				location.hash = ''
				process.nextTick(function() {
					next.fn(t, function() {
						t.end()
						runNext()
					})
				})
			})
			startIfNecessary()
		})
	})
}

domready(function() {
	tapBrowserColor()
	domIsReady = true
	startIfNecessary()
})

module.exports = {
	add: addTest,
	start: start
}