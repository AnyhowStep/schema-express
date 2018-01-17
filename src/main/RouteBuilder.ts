import * as schema from "schema-decorator";
import * as expressCore from "express-serve-static-core";
import * as express from "express";
import {HandlerArray} from "./HandlerArray";
import {VoidHandler, RequestVoidHandler, ErrorVoidHandler} from "./VoidHandler";
import {Handler, RequestHandler, ErrorHandler, wrapHandler} from "./Handler";
import {SchemaHandler} from "./SchemaHandler";
import {DefaultLocalsT} from "./DefaultLocalsT";
import {wrapResponseHandler} from "./ResponseHandler";

export class RouteBuilder<
    RawParamT,
    ParamT extends schema.Param<RawParamT>,
    QueryT,
    BodyT,
    ResponseT,
    AccessTokenT extends schema.AccessTokenType | undefined,
    LocalsT extends Object = DefaultLocalsT,
    RouterT extends expressCore.IRouter|undefined = undefined
> {
    private route : schema.Route<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, schema.MethodLiteral>;
    private handlers : HandlerArray<ParamT, QueryT, BodyT, ResponseT>;
    private rawRouter : RouterT;
    private _dummyLocalsT? : LocalsT;
    public constructor (
        route: schema.Route<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, schema.MethodLiteral>,
        handlers : HandlerArray<ParamT, QueryT, BodyT, ResponseT>,
        rawRouter : RouterT
    ) {
        this.route = route;
        this.handlers = handlers;
        this.rawRouter = rawRouter;
        this._dummyLocalsT;

        //This should not happen, but just playing it safe
        if (route.getMethod() == "Contextual") {
            throw new Error(`Contextual method not allowed`);
        }
    }
    public static Create<
        RawParamT,
        ParamT extends schema.Param<RawParamT>,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT extends schema.AccessTokenType | undefined,
        LocalsT extends Object
    > (
        route: schema.Route<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, schema.MethodLiteral>
    ) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT,
        undefined
    > {
        return new RouteBuilder(
            route,
            [],
            undefined
        );
    }

    public voidHandler (handler : RequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT,
        RouterT
    >;
    public voidHandler (handler : ErrorVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT,
        RouterT
    >;
    public voidHandler (handler : VoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT,
        RouterT
    >;
    public voidHandler (handler : VoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT,
        RouterT
    > {

        return new RouteBuilder(
            this.route,
            [
                ...this.handlers,
                handler
            ],
            this.rawRouter
        );
    }
    public handler<L extends {}> (handler : RequestHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L>) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT & L,
        RouterT
    >;
    public handler<L extends {}> (handler : ErrorHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L>) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT & L,
        RouterT
    >;
    public handler<L extends {}> (handler : Handler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L>) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT & L,
        RouterT
    >;
    public handler<L extends {}> (handler : Handler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L>) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT & L,
        RouterT
    > {
        const newHandler = wrapHandler(handler);
        return new RouteBuilder(
            this.route,
            [
                ...this.handlers,
                newHandler
            ],
            this.rawRouter
        );
    }

    public static GetRouterMatcher (router : expressCore.IRouter, method : schema.MethodLiteral) : express.IRouterMatcher<expressCore.IRouter> {
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

    public setRouter (rawRouter : expressCore.IRouter) : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT,
        expressCore.IRouter
    > {
        return new RouteBuilder(
            this.route,
            this.handlers,
            rawRouter
        );
    }

    public build (this : RouteBuilder<
        RawParamT,
        ParamT,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT,
        LocalsT,
        expressCore.IRouter
    >) : void {
        const matcher = RouteBuilder.GetRouterMatcher(this.rawRouter, this.route.getMethod());
        matcher(
            this.route.args.path.getRouterPath(),
            wrapResponseHandler(this.route.args.responseT),
            SchemaHandler.CreateParameter(this.route.args.paramT),
            SchemaHandler.CreateQuery(this.route.args.queryT),
            SchemaHandler.CreateBody(this.route.args.bodyT),
            ...this.handlers
        );
    }
}
