import { Apira } from "../Apira";
import * as types from "../typings";
import { MethodsCreator } from "./MethodsCreator";

export class Paramless<Methods, Aux> extends MethodsCreator<Methods> {
    constructor(private apira: Apira<Aux>, private path: string) {
        super();
    }

    public request<Response, Query, Payload>(method: types.RequestMethod) {
        const endpoint = (this as any) as Paramless<
            types.Method<types.ParamlessRequest<Query, Payload>, Response, Aux>,
            Aux
        >;

        endpoint.method = (request, auxiliary) => {
            const resolver = Apira.getResolver(this.apira);
            const promise = resolver.send<Response, Query, Payload, void>(request, this.path, method, auxiliary);

            return promise;
        };

        return endpoint as MethodsCreator<typeof endpoint.method>;
    }
}
