import * as schema from "schema-decorator";
import * as expressCore from "express-serve-static-core";
import { Handler } from "./Handler";
import { VoidHandler } from "./VoidHandler";
import { DefaultLocalsT } from "./DefaultLocalsT";
import { RouteBuilder } from "./RouteBuilder";
export declare class Router<LocalsT extends Object = DefaultLocalsT, AppT extends expressCore.Express | undefined = undefined> {
    private rawRouter;
    private rawApp;
    private _dummyLocalsT?;
    constructor(rawRouter: expressCore.Router, rawApp: AppT);
    static Create<LocalsT>(rawRouter?: expressCore.Router): Router<LocalsT, undefined>;
    getRawRouter(): expressCore.Router;
    useVoid(handler: VoidHandler<{}, {}, {}, {}, LocalsT>): Router<LocalsT, AppT>;
    use<L extends {}>(handler: Handler<{}, {}, {}, {}, LocalsT, L>): Router<LocalsT & L, AppT>;
    add<RawParamT, ParamT extends schema.Param<RawParamT>, QueryT, BodyT, ResponseT, AccessTokenT extends schema.AccessTokenType | undefined>(route: schema.Route<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, schema.MethodLiteral>): RouteBuilder<RawParamT, ParamT, QueryT, BodyT, ResponseT, AccessTokenT, LocalsT, expressCore.IRouter>;
    setApp(rawApp: expressCore.Express): Router<LocalsT, expressCore.Express>;
    build(this: Router<LocalsT, expressCore.Express>): void;
}
