/// <reference types="express" />
import * as express from "express";
import * as schema from "schema-decorator";
import { RequestVoidHandler } from "./VoidHandler";
export declare function wrapResponse<ResponseT>(res: express.Response, responseAssertion: schema.Assertion<ResponseT>): void;
export declare function wrapResponseHandler<ResponseT>(responseAssertion: schema.Assertion<ResponseT>): RequestVoidHandler<any, any, any, ResponseT, any>;
