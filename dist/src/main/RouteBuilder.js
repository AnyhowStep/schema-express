"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Handler_1 = require("./Handler");
const SchemaHandler_1 = require("./SchemaHandler");
const ResponseHandler_1 = require("./ResponseHandler");
class RouteBuilder {
    constructor(route, handlers, rawRouter) {
        this.route = route;
        this.handlers = handlers;
        this.rawRouter = rawRouter;
        this._dummyLocalsT;
        //This should not happen, but just playing it safe
        if (route.getMethod() == "Contextual") {
            throw new Error(`Contextual method not allowed`);
        }
    }
    static Create(route) {
        return new RouteBuilder(route, [], undefined);
    }
    voidHandler(handler) {
        return new RouteBuilder(this.route, [
            ...this.handlers,
            handler
        ], this.rawRouter);
    }
    handler(handler) {
        const newHandler = Handler_1.wrapHandler(handler);
        return new RouteBuilder(this.route, [
            ...this.handlers,
            newHandler
        ], this.rawRouter);
    }
    static GetRouterMatcher(router, method) {
        switch (method) {
            case "GET": {
                return router.get.bind(router);
            }
            case "POST": {
                return router.post.bind(router);
            }
            case "PUT": {
                return router.put.bind(router);
            }
            case "DELETE": {
                return router.delete.bind(router);
            }
            case "PATCH": {
                return router.patch.bind(router);
            }
            case "HEAD": {
                return router.head.bind(router);
            }
            case "OPTIONS": {
                return router.options.bind(router);
            }
            case "CONNECT": {
                return router.connect.bind(router);
            }
            default: {
                throw new Error(`Method ${method} not allowed`);
            }
        }
    }
    setRouter(rawRouter) {
        return new RouteBuilder(this.route, this.handlers, rawRouter);
    }
    build() {
        const matcher = RouteBuilder.GetRouterMatcher(this.rawRouter, this.route.getMethod());
        matcher(this.route.args.path.getRouterPath(), ResponseHandler_1.wrapResponseHandler(this.route.args.responseT), SchemaHandler_1.SchemaHandler.CreateParameter(this.route.args.paramT), SchemaHandler_1.SchemaHandler.CreateQuery(this.route.args.queryT), SchemaHandler_1.SchemaHandler.CreateBody(this.route.args.bodyT), ...this.handlers);
    }
}
exports.RouteBuilder = RouteBuilder;
//# sourceMappingURL=RouteBuilder.js.map