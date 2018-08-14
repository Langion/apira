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
            types.Method<types.ParamfulRequest<Query, Payload, Params>, Response, Aux, Data>,
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
