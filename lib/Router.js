var url = require('url');

import {RouteNotFoundError} from './errors/RouteNotFoundError';
import {Route} from './Route';

export class Router {
    static instance() {
        if (Router.newInstance) {
            return Router.newInstance;
        }

        Router.newInstance = new Router();
        return Router.newInstance;
    }

    static middleware(req, res, next) {
        var parsedUrl = url.parse(req.url);
        var router = Router.instance();

        try {
            var route = router.matchRoute(parsedUrl.pathname, req.method);
            route.applyFor(parsedUrl.pathname, req, res, next);
        } catch (e) {
            if (e instanceof RouteNotFoundError) {
                // TODO: Add ability to customize route not found errors
                res.writeHead(404);
                res.end('No route matches ' + parsedUrl.pathname);

                next();
            }
        }
    }

    constructor() {
        this.routes = [];
    }

    /**
     * Create a new route
     *
     * @param  {String}    method    Http method
     * @param  {String}    routeDef  A route definition string
     * @param  {Function}  action    The function that will be called when
     *                               this route is hit
     */
    route(method, routeDef, action) {
        if (typeof action === 'undefined') {
            action = routeDef;
            routeDef = method;
            method = 'GET';
        }

        if (typeof action !== 'function') {
            throw new TypeError('action must be a function');
        }

        var route = new Route(method, routeDef, action);
        this.routes.push(route);
    }

    /**
     * Match a route by path and method
     *
     * @param {String} Path to match
     * @param {String} Method of the request
     *
     * @returns {Object} Matched route object
     */
    matchRoute(path, method) {
        var foundRoute;

        this.routes.forEach((r) => {
           var matches = r.matcher.exec(path);

          if (matches && matches[0] === path && r.method === method) {
              foundRoute = r;
          }
        });

        if (!foundRoute) {
            throw new RouteNotFoundError(path);
        }

        return foundRoute;
    }
}

// export class for nodejs
module.exports = Router;