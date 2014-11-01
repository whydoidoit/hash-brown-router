var router = require('../')
var tester = require('./jankety-test-harness.js')

tester.add('routing on a simple url', function(t, done) {
	var route = router()

	t.plan(1)

	route.add('/non-butts', function() {
		t.fail('the wrong route was called')
	})

	route.add('/butts', function() {
		t.pass('the correct route was called')
	})

	route.setDefault(function() {
		t.fail('the default route was called')
	})

	location.hash = '/butts'

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('default function is called when nothing matches', function(t, done) {
	t.plan(2)

	var route = router()

	var fail = t.fail.bind(t, 'the wrong route was called')

	route.add('/butts', fail)
	route.add('/non-butts', fail)

	route.setDefault(function(path) {
		t.pass('the default route was called')
		t.equal('/lulz', path, 'the default path was passed in')
	})

	location.hash = '/lulz'

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('evaluating the current path instead of waiting for an onhashchange', function(t, done) {
	t.plan(1)

	location.hash = '/butts'

	setTimeout(function() {
		var route = router()

		route.add('/non-butts', function() {
			t.fail('the wrong route was called')
		})

		route.add('/butts', function() {
			t.pass('the correct route was called')
		})

		route.setDefault(function() {
			t.fail('the default route was called')
		})

		// may not always want the route to fire in the same tick?
		route.go()

		route.stop()

		done()
	}, 200)
})

tester.add('matching an express-style url, getting parameters back', function(t, done) {
	var route = router()

	t.plan(2)

	route.add('/no/way', t.fail.bind(t, 'the wrong route was called'))

	route.add('/my/:special', function(parameters) {
		t.equal(typeof parameters, 'object', 'parameters object is an object')
		t.equal(parameters.special, 'input')
	})

	location.hash = '/my/input'

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('route.go calls the default route when the current path is empty', function(t, done) {
	var route = router()

	t.plan(1)

	route.add('/def', t.pass.bind(t, 'the default route was called'))
	route.add('/other', t.fail.bind(t, 'the wrong route was called'))

	route.go('/def')

	setTimeout(function() {
		route.stop()
		done()
	}, 200)
})

tester.add('route.go does not call the default route when the current path is not empty', function(t, done) {
	location.hash = '/starting-path'

	t.plan(1)

	setTimeout(function() {
		var route = router()

		route.add('/def', t.fail.bind(t, 'the default route was called incorrectly'))
		route.add('/starting-path', t.pass.bind(t, 'the correct route was called'))

		route.go('/def')

		setTimeout(function() {
			route.stop()
			done()
		}, 200)

	}, 100)

})



tester.start()
