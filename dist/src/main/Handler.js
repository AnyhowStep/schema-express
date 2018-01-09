"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isRequestHandler(handler) {
    return handler.length <= 3;
}
exports.isRequestHandler = isRequestHandler;
//This lets us treat all handlers the same
function wrapHandler(handler) {
    if (isRequestHandler(handler)) {
        return (req, res, next) => {
            handler(req, res, (err, nxtLocals) => {
                Object.assign(res.locals, nxtLocals);
                next(err);
            });
        };
    }
    else {
        return (err, req, res, next) => {
            handler(err, req, res, (err, nxtLocals) => {
                Object.assign(res.locals, nxtLocals);
                next(err);
            });
        };
    }
}
exports.wrapHandler = wrapHandler;
//# sourceMappingURL=Handler.js.map