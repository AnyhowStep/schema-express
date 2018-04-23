/// <reference types="express" />
import * as schema from "schema-decorator";
import * as expressCore from "express-serve-static-core";
import * as express from "express";
import { HandlerArray } from "./HandlerArray";
import { VoidHandler, RequestVoidHandler, ErrorVoidHandler } from "./VoidHandler";
import { Handler, RequestHandler, ErrorHandler } from "./Handler";
import { AsyncVoidHandler, AsyncRequestVoidHandler, AsyncErrorVoidHandler } from "./AsyncVoidHandler";
import { DefaultLocalsT } from "./DefaultLocalsT";
export declare class RouteBuilder<RawParamT, ParamT extends schema.Param<RawParamT>, QueryT, BodyT, ResponseT, AccessTokenT extends schema.AccessTokenType | undefined, LocalsT extends Object = DefaultLocalsT, RouterT extends expressCore.IRouter | undefined = undefined> {
    private route;
    private handlers;
    private rawRouter;
    private _dummyLocalsT?;
    constructor(route: schema.Route<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, schema.MethodLiteral>, handlers: HandlerArray<ParamT, QueryT, BodyT, ResponseT>, rawRouter: RouterT);
    static Create<RawParamT, ParamT extends schema.Param<RawParamT>, QueryT, BodyT, ResponseT, AccessTokenT extends schema.AccessTokenType | undefined, LocalsT extends Object>(route: schema.Route<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, schema.MethodLiteral>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, undefined>;
    voidHandler(handler: RequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, RouterT>;
    voidHandler(handler: ErrorVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, RouterT>;
    voidHandler(handler: VoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, RouterT>;
    handler<L extends {}>(handler: RequestHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT & L, RouterT>;
    handler<L extends {}>(handler: ErrorHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT & L, RouterT>;
    handler<L extends {}>(handler: Handler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT & L, RouterT>;
    asyncVoidHandler(handler: AsyncRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, RouterT>;
    asyncVoidHandler(handler: AsyncErrorVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, RouterT>;
    asyncVoidHandler(handler: AsyncVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, RouterT>;
    static GetRouterMatcher(router: expressCore.IRouter, method: schema.MethodLiteral): express.IRouterMatcher<expressCore.IRouter>;
    setRouter(rawRouter: expressCore.IRouter): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, expressCore.IRouter>;
    build(this: RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, expressCore.IRouter>): void;
}
