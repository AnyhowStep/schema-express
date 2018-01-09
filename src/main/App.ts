import * as express from "express";
import * as expressCore from "express-serve-static-core";
import {DefaultLocalsT} from "./DefaultLocalsT";
import {Handler, RequestHandler, ErrorHandler, wrapHandler} from "./Handler";
import {VoidHandler, RequestVoidHandler, ErrorVoidHandler} from "./VoidHandler";
import {Router} from "./Router";

export interface RouterMatcher<LocalsT, ReturnT> {
    (
        path : string,
        ...handlers : (RequestVoidHandler<{}, {}, {}, {}, LocalsT>)[]
    ) : ReturnT;
    (
        path : string,
        ...handlers : (ErrorVoidHandler<{}, {}, {}, {}, LocalsT>)[]
    ) : ReturnT;
    (
        path : string,
        ...handlers : (RequestHandler<{}, {}, {}, {}, LocalsT, any>)[]
    ) : ReturnT;
    (
        path : string,
        ...handlers : (ErrorHandler<{}, {}, {}, {}, LocalsT, any>)[]
    ) : ReturnT;
    (
        path : string,
        ...handlers : (
            VoidHandler<{}, {}, {}, {}, LocalsT> |
            Handler<{}, {}, {}, {}, LocalsT, any>
        )[]
    ) : ReturnT;
}

export function toRouterMatcher<LocalsT extends Object, ReturnT> (matcher : expressCore.IRouterMatcher<any>, returnValue : ReturnT) : RouterMatcher<LocalsT, ReturnT> {
    return (path : string, ...handlers : (VoidHandler<{}, {}, {}, {}, LocalsT>|Handler<{}, {}, {}, {}, LocalsT, any>)[]) => {
        matcher(path, ...handlers);
        return returnValue;
    };
}

export class App <LocalsT extends Object = DefaultLocalsT> {
    private rawApp : expressCore.Express;
    private _dummyLocalsT? : LocalsT;

    //If you really want to be *that* lazy
    //You don't really gain many benefits doign this, though
    public get     : RouterMatcher<LocalsT, this>;
    public post    : RouterMatcher<LocalsT, this>;
    public put     : RouterMatcher<LocalsT, this>;
    public delete  : RouterMatcher<LocalsT, this>;
    public patch   : RouterMatcher<LocalsT, this>;
    public head    : RouterMatcher<LocalsT, this>;
    public options : RouterMatcher<LocalsT, this>;
    public connect : RouterMatcher<LocalsT, this>;

    public constructor (rawApp? : expressCore.Express) {
        if (rawApp == undefined) {
            rawApp = express();
        }
        this.rawApp = rawApp;
        this._dummyLocalsT;

        this.get     = toRouterMatcher(rawApp.get.bind(rawApp), this);
        this.post    = toRouterMatcher(rawApp.post.bind(rawApp), this);
        this.put     = toRouterMatcher(rawApp.put.bind(rawApp), this);
        this.delete  = toRouterMatcher(rawApp.delete.bind(rawApp), this);
        this.patch   = toRouterMatcher(rawApp.patch.bind(rawApp), this);
        this.head    = toRouterMatcher(rawApp.head.bind(rawApp), this);
        this.options = toRouterMatcher(rawApp.options.bind(rawApp), this);
        this.connect = toRouterMatcher(rawApp.connect.bind(rawApp), this);
    }
    public getRawApp () {
        return this.rawApp;
    }
    public useVoid (handler : RequestVoidHandler<{}, {}, {}, {}, LocalsT>) : App<LocalsT>;
    public useVoid (handler : ErrorVoidHandler<{}, {}, {}, {}, LocalsT>) : App<LocalsT>;
    public useVoid (handler : VoidHandler<{}, {}, {}, {}, LocalsT>) : App<LocalsT> {
        this.rawApp.use(handler);
        return this;
    }
    public use<L extends {}> (handler : RequestHandler<{}, {}, {}, {}, LocalsT, L>) : App<LocalsT & L>;
    public use<L extends {}> (handler : ErrorHandler<{}, {}, {}, {}, LocalsT, L>) : App<LocalsT & L>;
    public use<L extends {}> (handler : Handler<{}, {}, {}, {}, LocalsT, L>) : App<LocalsT & L> {
        const newHandler = wrapHandler(handler);
        this.rawApp.use(newHandler);
        return this as any;
    }
    public createRouter () : Router<LocalsT, expressCore.Express> {
        return Router.Create<LocalsT>()
            .setApp(this.rawApp);
    }
}
