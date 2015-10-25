var connect = require('connect');
var request = require('supertest');

var Router = require('../../dist/Router');

var app = connect();
var router = Router.instance();

app.use(Router.middleware);

// Simple route
router.addRoute('/test', function (req, res, next) {
	res.end('I was called');
	next();
});

// Route with one parameter
router.addRoute('/test/:id', function (req, res, next) {
	res.end('I was called with param ' + req.params.id);
	next();
});

describe('Router e2e', function () {
	it('should call a simple route', function (done) {
		request(app)
			.get('/test')
			.expect(200)
			.expect('I was called', done);
	});

	it('should call a route with one parameter', function (done) {
		request(app)
			.get('/test/10')
			.expect(200)
			.expect('I was called with param ' + 10, done);
	});
});