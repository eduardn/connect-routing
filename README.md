[![Build Status](https://travis-ci.org/eduardn/connect-routing.svg?branch=master)](https://travis-ci.org/eduardn/connect-routing)

# connect-routing
A router for connect written in ES6. This project aims to be a complete and fully featured router for connect.

# Docs
## Use with the provided middleware

```JavaScript
var connect = require('connect');
var Router = require('connect-routing');

var app = connect();
var router = Router.instance();

app.use(Router.middleware);

router.addRoute('/my/simple/route', function (req, res, next) {
    res.end('Hello, world!');
    next();
});
```

## Use with your own middleware

```JavaScript
var connect = require('connect');
var Router = require('connect-routing');

var app = connect();
var router = Router.instance();

app.use(function (req, res, next) {

    // .... Your custom code here ....

    // Parse the url and get the pathname
    // Try to call the route
    try {
        router.callRoute(path, req, res, next);
    } catch (e) {
        // If no route is found display a 404 to the user, or some error

        // .... Error code here ....
    }
});

router.addRoute('/my/simple/route', function (req, res, next) {
    res.end('Hello, world!');
    next();
});
```

## Route Parameters
Path parameters will be available in the ```req.params``` object. See the example below.

```JavaScript
var connect = require('connect');
var Router = require('connect-routing');

var app = connect();
var router = Router.instance();

app.use(Router.middleware);

router.addRoute('/users/:userId', function (req, res, next) {
    res.end('Found user with id ' + req.params.userId);
    next();
});
```

## Parameters regex matchers
Parameters can have custom regex matchers, for example you might want to accept
only numbers for a certain parameter. To do that you define your parameter with
a name followed by a regex in parenthesis (e.g. ```:id(([0-9]+))```).

```JavaScript
var connect = require('connect');
var Router = require('connect-routing');

var app = connect();
var router = Router.instance();

app.use(Router.middleware);

router.addRoute('/users/:id(([0-9]+))', function (req, res, next) {
    res.end('This route matched the number ' + req.params.id + ' for id parameter');
    next();
});
```

### Things to do
- [x] Tests
- [x]  Build process
- [x] CI
- [x] Exceptions || better error handling
- [x] Custom route parameters matchers
- [x] Docs
- [ ] Publish first version to npm
- [ ] Complete this list with more features
