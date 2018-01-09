import { Request } from "./Request";
import { Response } from "./Response";
import { VoidNextFunction } from "./VoidNextFunction";
export interface RequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> {
    (req: Request<ParamT, QueryT, BodyT>, res: Response<ResponseT, LocalsT>, next: VoidNextFunction): void;
}
export interface ErrorVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> {
    (err: any, req: Request<ParamT, QueryT, BodyT>, res: Response<ResponseT, LocalsT>, next: VoidNextFunction): void;
}
export declare type VoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> = (RequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT> | ErrorVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>);
export declare function isRequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>(handler: VoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>): handler is RequestVoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT>;
