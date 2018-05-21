import * as types from "../typings";

export abstract class Resolver<Aux> {
    protected abstract basePath: string;

    protected abstract request: <Response, Query, Payload, Params>(
        data: types.RequestData<Query, Payload, Params, Aux>
    ) => Promise<Response>;

    public send<Response, Query, Payload, Params>(
        request: types.ParamlessRequest<Query, Payload>,
        path: string,
        method: types.RequestMethods,
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
        const variable = `${key}=${value}`;
        return variable;
    }
}
