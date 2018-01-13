import * as expressCore from "express-serve-static-core";
import { DefaultLocalsT } from "./DefaultLocalsT";
import { Handler, RequestHandler, ErrorHandler } from "./Handler";
import { VoidHandler, RequestVoidHandler, ErrorVoidHandler } from "./VoidHandler";
import { Router } from "./Router";
export interface RouterMatcher<LocalsT, ReturnT> {
    (path: string, ...handlers: (RequestVoidHandler<{}, {}, {}, {}, LocalsT>)[]): ReturnT;
    (path: string, ...handlers: (ErrorVoidHandler<{}, {}, {}, {}, LocalsT>)[]): ReturnT;
    (path: string, ...handlers: (RequestHandler<{}, {}, {}, {}, LocalsT, any>)[]): ReturnT;
    (path: string, ...handlers: (ErrorHandler<{}, {}, {}, {}, LocalsT, any>)[]): ReturnT;
    (path: string, ...handlers: (VoidHandler<{}, {}, {}, {}, LocalsT> | Handler<{}, {}, {}, {}, LocalsT, any>)[]): ReturnT;
}
export declare function toRouterMatcher<LocalsT extends Object, ReturnT>(matcher: expressCore.IRouterMatcher<any>, returnValue: ReturnT): RouterMatcher<LocalsT, ReturnT>;
export declare class App<LocalsT extends Object = DefaultLocalsT> {
    private rawApp;
    private _dummyLocalsT?;
    get: RouterMatcher<LocalsT, this>;
    post: RouterMatcher<LocalsT, this>;
    put: RouterMatcher<LocalsT, this>;
    delete: RouterMatcher<LocalsT, this>;
    patch: RouterMatcher<LocalsT, this>;
    head: RouterMatcher<LocalsT, this>;
    options: RouterMatcher<LocalsT, this>;
    connect: RouterMatcher<LocalsT, this>;
    constructor(rawApp?: expressCore.Express);
    getRawApp(): expressCore.Express;
    useVoid(handler: RequestVoidHandler<{}, {}, {}, {}, LocalsT>): App<LocalsT>;
    useVoid(handler: ErrorVoidHandler<{}, {}, {}, {}, LocalsT>): App<LocalsT>;
    use<L extends {}>(handler: RequestHandler<{}, {}, {}, {}, LocalsT, L>): App<LocalsT & L>;
    use<L extends {}>(handler: ErrorHandler<{}, {}, {}, {}, LocalsT, L>): App<LocalsT & L>;
    createRouter(): Router<LocalsT, expressCore.Express>;
    useRouter(root: string, router: Router<any, expressCore.Express | undefined>): void;
}
