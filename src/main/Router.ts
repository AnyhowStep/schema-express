import * as schema from "schema-decorator";
import * as expressCore from "express-serve-static-core";
import * as express from "express";
import {Handler, wrapHandler} from "./Handler";
import {VoidHandler} from "./VoidHandler";
import {DefaultLocalsT} from "./DefaultLocalsT";
import {RouteBuilder} from "./RouteBuilder";

//TODO support param(), they're pretty cool
export class Router <
    LocalsT extends Object = DefaultLocalsT,
    AppT extends expressCore.Express|undefined = undefined
> {
    private rawRouter : expressCore.Router;
    private rawApp    : AppT;
    private _dummyLocalsT? : LocalsT;
    public constructor (rawRouter : expressCore.Router, rawApp : AppT) {
        this.rawRouter = rawRouter;
        this.rawApp = rawApp;
        this._dummyLocalsT;
    }
    public static Create<LocalsT> (rawRouter? : expressCore.Router) : Router<LocalsT, undefined> {
        if (rawRouter == undefined) {
            rawRouter = express.Router();
        }
        return new Router(
            rawRouter,
            undefined
        );
    }
    public getRawRouter () {
        return this.rawRouter;
    }

    public useVoid (handler : VoidHandler<{}, {}, {}, {}, LocalsT>) : Router<LocalsT, AppT> {
        this.rawRouter.use(handler);
        return this;
    }
    public use<L extends {}> (handler : Handler<{}, {}, {}, {}, LocalsT, L>) : Router<LocalsT & L, AppT> {
        const newHandler = wrapHandler(handler);
        this.rawRouter.use(newHandler);
        return this as any;
    }
    public add<
        RawParamT,
        ParamT extends schema.Param<RawParamT>,
        QueryT,
        BodyT,
        ResponseT,
        AccessTokenT extends schema.AccessTokenType | undefined
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
        expressCore.IRouter
    > {
        return RouteBuilder.Create<
            RawParamT,
            ParamT,
            QueryT,
            BodyT,
            ResponseT,
            AccessTokenT,
            LocalsT
        >(route).setRouter(this.rawRouter);
    }

    public setApp (rawApp : expressCore.Express) : Router<LocalsT, expressCore.Express> {
        return new Router(
            this.rawRouter,
            rawApp
        );
    }
    public getApp () {
        return this.rawApp;
    }
    public build (this : Router<LocalsT, expressCore.Express>) : void {
        this.rawApp.use(this.rawRouter);
    }
}
