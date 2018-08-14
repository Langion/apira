import * as types from "../typings";

export abstract class Resolver<Aux, Data> {
    protected abstract basePath: string;

    public abstract request<Response, Query, Payload, Params>(
        data: types.RequestData<Query, Payload, Params, Aux>,
    ): Promise<types.ResponseData<Response, Data>>;

    public send<Response, Query, Payload, Params>(
        request: types.ParamlessRequest<Query, Payload>,
        path: string,
        method: types.RequestMethod,
        auxiliary?: Aux,
        getPath?: types.ParamfulPath<Params>,
    ) {
        const promise = this.pure<Response, Query, Payload, Params>(request, path, method, auxiliary, getPath).then(
            (v) => v.response,
        );

        return promise;
    }

    public pure<Response, Query, Payload, Params>(
        request: types.ParamlessRequest<Query, Payload>,
        path: string,
        method: types.RequestMethod,
        auxiliary?: Aux,
        getPath?: types.ParamfulPath<Params>,
    ) {
        const parts: types.UrlParts<Query> = {
            path,
            query: request.query,
        };

        const url = this.createUrl(parts);

        const data: types.RequestData<Query, Payload, Params, Aux> = {
            auxiliary,
            getPath,
            method,
            request,
            url,
        };

        const promise = this.request<Response, Query, Payload, Params>(data);
        return promise;
    }

    protected createUrl<Query>(parts: types.UrlParts<Query>) {
        const query = this.createQuery(parts);
        const path = parts.path || "";
        const url = `${this.basePath}${path}${query}`;
        return url;
    }

    protected createQuery<Query>(parts: types.UrlParts<Query>) {
        if (!parts.query) {
            return "";
        }

        const keys = Object.keys(parts.query);
        const variables = keys.map((k) => this.getVariable(k, parts.query));
        const query = variables.join("&");
        return `?${query}`;
    }

    protected getVariable<Query>(key: string, query: Query) {
        const value = (query as any)[key];

        if (!value && value !== false) {
            return "";
        }

        const variable = `${key}=${encodeURI(value)}`;
        return variable;
    }
}
