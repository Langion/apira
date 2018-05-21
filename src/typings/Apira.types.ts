export type RequestMethods = "get" | "post" | "put" | "delete";

export type ParamfulPath<Params> = (params: Params) => string;

export type Method<Request, Response, Aux> = (request: Request, auxiliary?: Aux) => Promise<Response>;

export interface UrlParts<Query> {
    path: string;
    query: Query | null;
}

export interface ParamlessRequest<Query, Payload> {
    query: Query | null;
    payload: Payload | null;
}

export interface ParamfulRequest<Query, Payload, Params> extends ParamlessRequest<Query, Payload> {
    params: Params;
}

export interface RequestData<Query, Payload, Params, Aux> {
    url: string;
    request: ParamlessRequest<Query, Payload> | ParamfulRequest<Query, Payload, Params>;
    method: RequestMethods;
    getPath?: ParamfulPath<Params>;
    auxiliary?: Aux;
}
