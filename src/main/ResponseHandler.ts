import * as express from "express";
import * as schema from "schema-decorator";
import {RequestVoidHandler} from "./VoidHandler";

export function wrapResponse<ResponseT> (res : express.Response, responseAssertion : schema.Assertion<ResponseT>) : void {
    const originalJson = res.json.bind(res);
    res.json = (rawBody : any) => {
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
export function wrapResponseHandler<ResponseT> (responseAssertion : schema.Assertion<ResponseT>) : RequestVoidHandler<any, any, any, ResponseT, any> {
    return (_req, res, next) => {
        wrapResponse(res, responseAssertion);
        next();
    };
}
