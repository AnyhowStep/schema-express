import { Request } from "./Request";
import { Response } from "./Response";
import { NextFunction } from "./NextFunction";
import { VoidHandler } from "./VoidHandler";
export interface RequestHandler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> {
    (req: Request<ParamsT, QueryT, BodyT>, res: Response<ResponseT, LocalsT>, next: NextFunction<NxtLocalsT>): void;
}
export interface ErrorHandler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> {
    (err: any, req: Request<ParamsT, QueryT, BodyT>, res: Response<ResponseT, LocalsT>, next: NextFunction<NxtLocalsT>): void;
}
export declare type Handler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> = (RequestHandler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT> | ErrorHandler<ParamsT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT>);
export declare function isRequestHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT>(handler: Handler<ParamT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT>): handler is RequestHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, NxtLocalsT>;
export declare function wrapHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L extends {}>(handler: Handler<ParamT, QueryT, BodyT, ResponseT, LocalsT, L>): VoidHandler<ParamT, QueryT, BodyT, ResponseT, LocalsT & L>;
