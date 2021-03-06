//import * as sd from "schema-decorator";
import * as express from "express";

export interface ResponseData {
    locals?   : object,
    response? : any,
}
export type Locals<DataT extends ResponseData> = (
    "locals" extends keyof DataT ?
        DataT["locals"] :
        {}
);
export interface Response<DataT extends ResponseData> extends express.Response {
    locals : Locals<DataT>;
    json   : (
        "response" extends keyof DataT ?
            (response : DataT["response"]) => Response<DataT> :
            (response : any) => Response<DataT>
    );
    /*json   : (response : (
        RouteT["data"]["responseF"] extends sd.AnyAssertFunc ?
            sd.AcceptsOf<RouteT["data"]["responseF"]> :
            undefined
    ), unsafe? : "unsafe") => Response<RouteT, LocalsT>;*/
}
