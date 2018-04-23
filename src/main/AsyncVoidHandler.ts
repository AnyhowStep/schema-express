import {Request} from "./Request";
import {Response} from "./Response";
import {VoidNextFunction} from "./VoidNextFunction";
import {VoidHandler} from "./VoidHandler";

export interface AsyncRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> {
    (
        req  : Request<ParamT, QueryT, BodyT>,
        res  : Response<ResponseT, LocalsT>,
    ): Promise<void>;
}

export interface AsyncErrorVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> {
    (
        err  : any,
        req  : Request<ParamT, QueryT, BodyT>,
        res  : Response<ResponseT, LocalsT>,
    ): Promise<void>;
}

export type AsyncVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> = (
    AsyncRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> |
    AsyncErrorVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>
);

export function isAsyncRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> (
    handler : AsyncVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>
) : handler is AsyncRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> {
    return handler.length <= 2;
}

//This lets us treat all handlers the same
export function wrapAsyncVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> (
    handler : AsyncVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>
) : VoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> {
    if (isAsyncRequestVoidHandler(handler)) {
        return (req : Request<ParamT, QueryT, BodyT>, res : Response<ResponseT, LocalsT>, next : VoidNextFunction) => {
            handler(req, res)
                .then(next)
                .catch(next);
        };
    } else {
        return (err, req, res, next) => {
            handler(err, req, res)
                .then(next)
                .catch(next);
        };
    }
}
