"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = require("schema-decorator");
function wrapResponse(res, responseAssertion) {
    const originalJson = res.json.bind(res);
    res.json = (rawBody) => {
        //Restore the orignal json() method
        //So subsequent calls don't trigger type checks
        //If we're calling json() more than once, we're
        //probably in an erraneous state, anyway
        res.json = originalJson;
        if (res.statusCode >= 400 && res.statusCode < 600) {
            //We are in an erraneous state, we don't validate anything for now
            return originalJson(rawBody);
        }
        const cleanBody = schema.toClassOrAssert("response", rawBody, responseAssertion);
        const processedBody = schema.anyToRaw("response", cleanBody);
        return originalJson(processedBody);
    };
}
exports.wrapResponse = wrapResponse;
function wrapResponseHandler(responseAssertion) {
    return (_req, res, next) => {
        wrapResponse(res, responseAssertion);
        next();
    };
}
exports.wrapResponseHandler = wrapResponseHandler;
//# sourceMappingURL=ResponseHandler.js.map