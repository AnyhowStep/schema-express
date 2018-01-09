import * as express from "express";
export interface Request<ParamT, QueryT, BodyT> extends express.Request {
    params: ParamT;
    query: QueryT;
    body: BodyT;
}
