import { Handler } from "./Handler";
import { VoidHandler } from "./VoidHandler";
export declare type HandlerArray<ParamsT, QueryT, BodyT, ResponseT> = (Handler<ParamsT, QueryT, BodyT, ResponseT, any, any> | VoidHandler<ParamsT, QueryT, BodyT, ResponseT, any>)[];
