export type RequestMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "trace" | "connect";

export type ParamfulPath<Params> = (params: Params) => string;

export interface PureResponse<Response, Data> {
    response: Response;
    data: Data;
}

export interface Method<Request, Response, Aux, Data> {
    (request: Request, auxiliary?: Aux): Promise<Response>;
    pure(request: Request, auxiliary?: Aux): Promise<PureResponse<Response, Data>>;
}

export interface UrlParts<Query> {
    path: string;
    query?: Query | null;
}

export interface ParamlessRequest<Query, Payload> {
    query?: Query | null;
    payload: Payload | null;
}

export interface ParamfulRequest<Query, Payload, Params> extends ParamlessRequest<Query, Payload> {
    params: Params;
}

export interface RequestData<Query, Payload, Params, Aux> {
    url: string;
    request: ParamlessRequest<Query, Payload> | ParamfulRequest<Query, Payload, Params>;
    method: RequestMethod;
    getPath?: ParamfulPath<Params>;
    auxiliary?: Aux;
}

export interface ResponseData<Response, Data> {
    response: Response;
    data: Data;
}
