import {Request} from "./Request";
import {Response} from "./Response";
import {NextFunction} from "./NextFunction";
import {VoidNextFunction} from "./VoidNextFunction";
import {VoidHandler} from "./VoidHandler";

export interface RequestHandler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> {
    (
        req  : Request<ParamsT, QueryT, BodyT>,
        res  : Response<ResponseT, LocalsT>,
        next : NextFunction<NxtLocalsT>
    ): void;
}
export interface ErrorHandler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> {
    (
        err  : any,
        req  : Request<ParamsT, QueryT, BodyT>,
        res  : Response<ResponseT, LocalsT>,
        next : NextFunction<NxtLocalsT>
    ): void;
}
export type Handler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> = (
    RequestHandler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> |
    ErrorHandler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT>
)

export function isRequestHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> (
    handler : Handler<ParamT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT>
) : handler is RequestHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> {
    return handler.length <= 3;
}

//This lets us treat all handlers the same
export function wrapHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L extends {}> (
    handler : Handler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L>
) : VoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT & L> {
    if (isRequestHandler(handler)) {
        return (req : Request<ParamT, QueryT, BodyT>, res : Response<ResponseT, LocalsT>, next : VoidNextFunction) => {
            handler(req, res, (err : any, nxtLocals : L) => {
                Object.assign(res.locals, nxtLocals);
                next(err);
            });
        };
    } else {
        return (err, req, res, next) => {
            handler(err, req, res, (err : any, nxtLocals : L) => {
                Object.assign(res.locals, nxtLocals);
                next(err);
            });
        };
    }
}
