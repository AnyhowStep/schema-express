import * as express from "express";
export interface Response<ResponseT, LocalsT> extends express.Response {
    locals: LocalsT;
    json: (body: ResponseT) => Response<ResponseT, LocalsT>;
}
