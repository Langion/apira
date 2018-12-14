import { Apira } from "../Apira";
import * as types from "../typings";
import { MethodsCreator } from "./MethodsCreator";

export class Paramful<Params, Methods, Aux, Data> extends MethodsCreator<Methods> {
    constructor(private apira: Apira<Aux, Data>, private getPath: types.ParamfulPath<Params>) {
        super();
    }

    public request<Response, Query, Payload>(method: types.RequestMethod) {
        const endpoint = (this as any) as Paramful<
            Params,
            types.ParamfulMethod<types.ParamfulRequest<Query, Payload, Params>, Response, Aux, Data, Params, Query>,
            Aux,
            Data
        >;

        endpoint.method = ((request, auxiliary) => {
            const resolver = Apira.getResolver(this.apira);
            const path = this.getPath(request.params);

            const promise = resolver.send<Response, Query, Payload, Params>(
                request,
                path,
                method,
                auxiliary,
                this.getPath,
            );

            return promise;
        }) as typeof endpoint.method;

        endpoint.method.createPath = (params, query) => {
            const resolver = Apira.getResolver(this.apira);
            const path = this.getPath(params);
            const result = resolver.createUrl({ path, query });
            return result;
        };

        endpoint.method.pure = (request, auxiliary) => {
            const resolver = Apira.getResolver(this.apira);
            const path = this.getPath(request.params);

            const promise = resolver.pure<Response, Query, Payload, Params>(
                request,
                path,
                method,
                auxiliary,
                this.getPath,
            );

            return promise;
        };

        return endpoint as MethodsCreator<typeof endpoint.method>;
    }
}
