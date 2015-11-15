var connect = require('connect');
var request = require('supertest');

var Router = require('../../dist/Router');

var app = connect();
var router = Router.instance();

app.use(Router.middleware);

// Simple route
router.route('/test', function (req, res, next) {
    res.end('I was called');
    next();
});

// Route with one parameter
router.route('/test/:id', function (req, res, next) {
    res.end('I was called with param ' + req.params.id);
    next();
});

// Route with custom parameter
router.route('/test/custom/:id(([0-9])+)', function (req, res, next) {
    res.end('I was called with param ' + req.params.id);
    next();
});

// Route with mongoid type parameter
router.route('/test/complex/:userId(([a-f0-9]){24})', function (req, res, next) {
    res.end('Found user with id ' + req.params.userId);
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

    it('should respond with a not found error', function (done) {
        request(app)
            .get('/no/route')
            .expect('No route matches /no/route')
            .expect(404, done);
    });

    it('should call a route with a custom parameter', function (done) {
        request(app)
            .get('/test/custom/123456')
            .expect(200)
            .expect('I was called with param 123456', done);
    });

    it('should call a route with a complex parameter', function (done) {
        request(app)
            .get('/test/complex/1234567890abcdef12345678')
            .expect(200)
            .expect('Found user with id 1234567890abcdef12345678', done);
    });
});