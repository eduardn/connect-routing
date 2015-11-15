var Route = require('../../dist/Route.js').Route;
var noop = function() {};

describe('Route', function () {
    describe('#constructor()', function () {
        it('should create a matcher for a route', function () {
            var route = new Route('GET', '/test', noop);

            expect(route.matcher).toBeDefined();
        });

        it('should match a route with the constructed matcher', function () {
            var route = new Route('GET', '/test', noop);
            var path = '/test';
            var pathNegative = '/test/2';

            var positiveMatch = route.matcher.exec(path);
            var negativeMatch = route.matcher.exec(pathNegative);

            expect(positiveMatch[0]).toEqual(path);
            expect(negativeMatch[0]).not.toEqual(pathNegative);
        });
    });

    describe('#applyFor()', function () {
        it('should call the function associated with the route', function () {
            var action = jasmine.createSpy('action', noop);
            var route = new Route('GET', '/test', action);
            var params = {
                req: {},
                res: {},
                next: noop
            };

            route.applyFor('/test', params.req, params.res, params.next);

            expect(action).toHaveBeenCalled();
            expect(action.mostRecentCall.args[0].params).toBeDefined();
        });
    });
});