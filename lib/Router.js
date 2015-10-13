/**
 * Main router class. This will be a singleton the entire
 * application lifecycle.
 *
 * @file: Router.js
 *
 * @author: Eduard Neculaesi <neculaesi.eduard@gmail.com>
 * @since: 0.1
 */

var url = require('url');

export class Router {

    // Instantiate a singleton router
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
        
        router.callRoute(parsedUrl.pathname, req, res, next);
    }

    constructor() {
        this.routes = [];
    }

    /**
     * Add a route to the list of available routes.
     * 
     * @param {String} method  Method of the request.
     * @param {String} route   Route definition string.
     * @param {String} options Options object where a controller and action can be specified.
     *                         Can be replaced with a function to be called when route is hit.
     */
    addRoute(method, route, options) {
        if (typeof route === 'function' ||
            typeof route === 'object') {
            options = route;
            route = method;
            method = 'GET';
        }

        if (typeof options === 'function') {
            this.pushRoute(method, route, null, options);
        } else {
            this.pushRoute(method, route, options.controller, options.action);
        }
    }

    /**
     * Pushes a route to the list of available routes.
     *
     * @param {String} method     HTTP Method of this route
     * @param {String} route      Route path
     * @param {String} controller Controller name
     * @param {String} action     Name of the function to be executed when
     *                            route is intercepted
     */
    pushRoute(method, route, controller, action) {
        var routeMatcher = this.buildRouteMatcher(route);
                
        this.routes.push({
            method: method,
            name: route,
            controller: controller,
            action: action,
            matcher: routeMatcher
        });
    }

    /**
     * Calls a controller function based on the route and method
     * of the request.
     *
     * @param  {String}   path Route from the url
     * @param  {Object}   req   Request object
     * @param  {Object}   res   Response Object
     * @param  {Object}   next  Middleware callback function
     */
    callRoute(path, req, res, next) {
        var route = null;
        var method = req.method;

        this.routes.forEach(function (r) {
            var matches = r.matcher.exec(path);

            if (matches && matches[0] === path && r.method === method) {
                route = r;
            }
        });

        if (!route) {
            console.error('No route found for', path);
            return;
        }
        
        // Get all the path parameters
        var params = this.getParameterValues(route, path);

        // Add req as the last parameter of the function
        req.params = params;
        
        if (route.controller) {
            this.callController(route, req, res, next);
        } else {
            route.action(req, res, next);
        }
    }
    
    // TODO: Refactor - get Controller constructor instead of name
    callController(route, req, res, next) {
        var ctrlFn = (require('../../controllers/' + route.controller)[route.controller]);
        var ctrl = new ctrlFn();
        var routeFunction = ctrl[route.action];

        // TODO: Check for a funciton instead of truthy
        if (typeof routeFunction !== 'function') {
            console.error('No function found for ', route.controller + '#' + route.action);
            return;
        }

        ctrl[route.action](req, res, next);
    }

    /**
     * Gets the parameter values from the path based on
     * the route's definition.
     *
     * @param  {Object} route The matched route
     * @param  {String} path  Route from the request url
     *
     * @return {Object}       An array with the parameter values in the
     *                        route definition order.
     */
    getParameterValues(route, path) {
        var routeParts = route.name.split('/');
        var pathParts = path.split('/');
        var paramIdentifiers = [];
        var values = {};

        routeParts.forEach(function (part, index) {
            if (part.charAt(0) === ':') {
                var identifier = {
                    name: part.slice(1, part.length),
                    index: index
                };
                
                paramIdentifiers.push(identifier);
            }
        })

        paramIdentifiers.forEach(function (identifier) {
            values[identifier.name] = pathParts[identifier.index];
        });
        
        return values;
    }

    /**
     * Builds a regex for matching the provided route.
     *
     * @param  {String} route A string definition for a route
     *
     * @return {RegExp}       A regexp that will match the string definition
     */
    buildRouteMatcher(route) {
        // Strip first '/' if present
        if (route.charAt(0) === '/') {
            route = route.slice(1, route.length);
        }

        var parts = route.split('/');
        var matcherParts = parts.map(function (routePart, index) {

            var beginning = index === 0 ? '\/' : '';

            if (routePart.charAt(0) === ':') {
                // A path param is defined so create
                // a default matcher for it
                // TODO: Add support for custom matchers
                return beginning + '([a-zA-Z0-9])+\/?';
            } else {
                return beginning + routePart + '\/?';
            }
        });

        return new RegExp(matcherParts.join(''));
    }
}

// export class for nodejs
module.exports = Router;