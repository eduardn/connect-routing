var Router = require('../../dist/Router');
var noop = function() {};
var router;

describe('Router', function () {
    beforeEach(function () {
        router = Router.instance();
    });

    describe('#middleware()', function () {
        var requestParams = {
            req: {
                url: '/test/route',
                method: 'GET'
            },
            res: {},
            next: function() {}
        };

        it('should call callRoute', function () {
            spyOn(router, 'callRoute');
            Router.middleware(requestParams.req, requestParams.res, requestParams.next);

            expect(router.callRoute).toHaveBeenCalled();
            expect(router.callRoute).toHaveBeenCalledWith(
                requestParams.req.url, requestParams.req, requestParams.res, requestParams.next);
        });

        it('should match a simple route', function () {
            var routeFunction = jasmine.createSpy('routeAction', function () {});
            router.addRoute('/test/route', routeFunction);

            Router.middleware(requestParams.req, requestParams.res, requestParams.next);

            expect(routeFunction).toHaveBeenCalled();
            expect(routeFunction).toHaveBeenCalledWith(
                requestParams.req, requestParams.res, requestParams.next);
        });

        it('should match a route with one parameter', function () {
            var routeFunction = jasmine.createSpy('routeAction', function () {});
            requestParams.req.url = '/test/route/1';

            router.addRoute('/test/route/:id', routeFunction);
            Router.middleware(requestParams.req, requestParams.res, requestParams.next);

            expect(routeFunction).toHaveBeenCalled();
            expect(routeFunction.mostRecentCall.args.length).toEqual(3);
            expect(routeFunction).toHaveBeenCalledWith(
                requestParams.req, requestParams.res, requestParams.next);

            // Get the request argument from the route function
            var req = routeFunction.mostRecentCall.args[0];

            expect(req.params).toBeDefined();
            expect(req.params.id).toEqual('1');
        });

        it('should match a route with a custom parameter', function () {
            var routeFunction = jasmine.createSpy('routeAction', function () {});
            requestParams.req.url = '/test/route/20';

            router.addRoute('/test/route/:id(([0-9]+))', routeFunction);
            Router.middleware(requestParams.req, requestParams.res, requestParams.next);

            expect(routeFunction).toHaveBeenCalled();
            expect(routeFunction.mostRecentCall.args.length).toEqual(3);
            expect(routeFunction).toHaveBeenCalledWith(
                requestParams.req, requestParams.res, requestParams.next);

            // Get the request argument from the route function
            var req = routeFunction.mostRecentCall.args[0];

            expect(req.params).toBeDefined();
            expect(req.params.id).toEqual('20');
        });

        it('should not match a route with a custom parameter', function () {
            var routeFunction = jasmine.createSpy('routeAction', function () {});
            requestParams.req.url = '/test/route/abghddd22';

            router.addRoute('/test/route/:id(([0-9]+))', routeFunction);
            Router.middleware(requestParams.req, requestParams.res, requestParams.next);

            expect(routeFunction).not.toHaveBeenCalled();
        });
    });

    describe('#addRoute()', function () {
        beforeEach(function () {
            // Reset routes
            router.routes.length = 0;
        });

        it('should add a new route to the list', function () {
            router.addRoute('/test/add/route', noop);

            expect(router.routes.length).toEqual(1);
        });

        it('should throw an error when no function provided', function () {
            var testFn = function () {
                router.addRoute('/test/add/route/error');
            };

             expect(testFn).toThrow();
        });

        it('should throw an error on route configuration issues', function () {
            var options = {};
            var testFn = function () {
                router.addRoute('/test/add/route/options/error', options);
            };

            expect(testFn).toThrow();
        });
    });
});
