"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assign_1 = require("./assign");
function isRequestHandler(handler) {
    return handler.length <= 3;
}
exports.isRequestHandler = isRequestHandler;
//This lets us treat all handlers the same
function wrapHandler(handler) {
    if (isRequestHandler(handler)) {
        const requestVoidHandler = (req, res, next) => {
            handler(req, res, (err, nxtLocals) => {
                //Overwrite res.locals
                assign_1.assign(res.locals, nxtLocals);
                next(err);
            });
        };
        return requestVoidHandler;
    }
    else {
        const errorVoidHandler = (err, req, res, next) => {
            handler(err, req, res, (err, nxtLocals) => {
                //Overwrite res.locals
                assign_1.assign(res.locals, nxtLocals);
                next(err);
            });
        };
        return errorVoidHandler;
    }
}
exports.wrapHandler = wrapHandler;
//# sourceMappingURL=Handler.js.map