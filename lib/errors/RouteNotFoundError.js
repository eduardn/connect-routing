
export class RouteNotFoundError extends Error {
    constructor(path) {
        var message = 'Route for ' + path + ' not found!';

        super(message);

        this.name = this.constructor.name;
        this.message = message;
    }
}