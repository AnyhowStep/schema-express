import * as express from "express";
import {toClassOrAssert, Assertion} from "schema-decorator";
import {RequestVoidHandler} from "./VoidHandler";

export class SchemaHandler {
    public static Create<T> (
        getRaw : (req  : express.Request, res : express.Response) => {
            name  : string,
            value : any,
        },
        setRaw : (req  : express.Request, res : express.Response, value : T) => void,
        assertion : Assertion<T>
    ) : RequestVoidHandler<any, any, any, any, any> {
        return (req, res, next) => {
            let raw = getRaw(req, res);
            if (raw.value == undefined) {
                raw.value = {};
            }
            const value = toClassOrAssert(raw.name, raw.value, assertion);
            setRaw(req, res, value);
            next();
        };
    }

    public static CreateParameter<T> (assertion : Assertion<T>) {
        return SchemaHandler.Create(
            (req) => {
                return {
                    name  : "parameter",
                    value : req.params,
                };
            },
            (req, _res, value) =>{
                req.params = value;
            },
            assertion
        );
    }
    public static CreateQuery<T> (assertion : Assertion<T>) {
        return SchemaHandler.Create(
            (req) => {
                return {
                    name  : "query",
                    value : req.query,
                };
            },
            (req, _res, value) =>{
                req.query = value;
            },
            assertion
        );
    }
    public static CreateBody<T> (assertion : Assertion<T>) {
        return SchemaHandler.Create(
            (req) => {
                return {
                    name  : "body",
                    value : req.body,
                };
            },
            (req, _res, value) =>{
                req.body = value;
            },
            assertion
        );
    }
}
