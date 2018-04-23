import { Request } from "./Request";
import { Response } from "./Response";
import { VoidHandler } from "./VoidHandler";
export interface AsyncRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> {
    (req: Request<ParamT, QueryT, BodyT>, res: Response<ResponseT, LocalsT>): Promise<void>;
}
export interface AsyncErrorVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> {
    (err: any, req: Request<ParamT, QueryT, BodyT>, res: Response<ResponseT, LocalsT>): Promise<void>;
}
export declare type AsyncVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> = (AsyncRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> | AsyncErrorVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>);
export declare function isAsyncRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>(handler: AsyncVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>): handler is AsyncRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>;
export declare function wrapAsyncVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>(handler: AsyncVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>): VoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>;
