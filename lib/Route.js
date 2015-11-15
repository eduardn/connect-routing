export class Route {
    constructor(method, name, action) {
        this.method = method;
        this.name = name;
        this.action = action;

        this.matcher = createMatcher.apply(this);
    }

    /**
     * Call the action for this route using the provided path
     *
     * @param  {String}  path  Path used to get parameter
     *                         values if route has them defined
     * @param  {Object}  req   Request object
     * @param  {Object}  res   Response object
     * @param  {Object}  next  Request callback
     */
    applyFor(path, req, res, next) {
        var params = getParameterValues.call(this, path)
        req.params = params;

        this.action(req, res, next);
    }
}

/**
 * Get path parameter values
 *
 * @param  {String}  path  Url of the request
 */
function getParameterValues(path) {
    var routeParts = this.name.split('/');
    var pathParts = path.split('/');
    var params = {};

    routeParts.forEach((part, index) => {
        if (part.charAt(0) === ':') {
            var parameterName = part.match(/([a-zA-Z0-9]+)/);
            params[parameterName[0]] = pathParts[index];
        }
    });

    return params;
}

/**
 * Create a RegExp for matching this route's definition
 *
 * @return {RegExp} Returns the constructed RegExp object
 */
function createMatcher() {
    var route = this.name;

    // Strip first '/' if present
    if (route.charAt(0) === '/') {
        route = route.slice(1, route.length);
    }

    var parts = route.split('/');
    var customMatcherFinder = /(?:\()(.+)(?:\))/;
    var ending = '\/?';

    var matcherParts = parts.map(function (routePart, index) {
        var beginning = index === 0 ? '\/' : '';

        if (routePart.charAt(0) === ':') {
            var customMatcher = routePart.match(customMatcherFinder);

            if (customMatcher) {
                // Custom matcher defined
                return beginning + customMatcher[1] + ending;
            } else {
                // Set default matcher for parameter
                return beginning + '([a-zA-Z0-9]+)' + ending;
            }
        } else {
            return beginning + routePart + ending;
        }
    });

    return new RegExp(matcherParts.join(''));
}