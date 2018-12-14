import { Apira } from "../Apira";
import * as types from "../typings";
import { MethodsCreator } from "./MethodsCreator";

export class Paramless<Methods, Aux, Data> extends MethodsCreator<Methods> {
    constructor(private apira: Apira<Aux, Data>, private path: string) {
        super();
    }

    public request<Response, Query, Payload>(method: types.RequestMethod) {
        const endpoint = (this as any) as Paramless<
            types.ParamlessMethod<types.ParamlessRequest<Query, Payload>, Response, Aux, Data, Query>,
            Aux,
            Data
        >;

        endpoint.method = ((request, auxiliary) => {
            const resolver = Apira.getResolver(this.apira);
            const promise = resolver.send<Response, Query, Payload, void>(request, this.path, method, auxiliary);

            return promise;
        }) as typeof endpoint.method;

        endpoint.method.createPath = (query) => {
            const resolver = Apira.getResolver(this.apira);
            const result = resolver.createUrl({ path: this.path, query });
            return result;
        };

        endpoint.method.pure = (request, auxiliary) => {
            const resolver = Apira.getResolver(this.apira);
            const promise = resolver.pure<Response, Query, Payload, void>(request, this.path, method, auxiliary);

            return promise;
        };

        return endpoint as MethodsCreator<typeof endpoint.method>;
    }
}
