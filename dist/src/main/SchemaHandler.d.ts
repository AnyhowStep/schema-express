/// <reference types="express" />
import * as express from "express";
import { Assertion } from "schema-decorator";
import { RequestVoidHandler } from "./VoidHandler";
export declare class SchemaHandler {
    static Create<T>(getRaw: (req: express.Request, res: express.Response) => {
        name: string;
        value: any;
    }, setRaw: (req: express.Request, res: express.Response, value: T) => void, assertion: Assertion<T>): RequestVoidHandler<any, any, any, any, any>;
    static CreateParameter<T>(assertion: Assertion<T>): RequestVoidHandler<any, any, any, any, any>;
    static CreateQuery<T>(assertion: Assertion<T>): RequestVoidHandler<any, any, any, any, any>;
    static CreateBody<T>(assertion: Assertion<T>): RequestVoidHandler<any, any, any, any, any>;
}
