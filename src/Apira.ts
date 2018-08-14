import { Paramful } from "./core/Paramful";
import { Paramless } from "./core/Paramless";
import { Resolver } from "./core/Resolver";
import * as types from "./typings";

export class Apira<Aux = void, Data = void> {
    public static setResolver<Aux, Data>(resolver: Resolver<Aux, Data>, apira: Apira<Aux, Data>) {
        apira.resolver = resolver;
    }

    public static getResolver<Aux, Data>(apira: Apira<Aux, Data>): Resolver<Aux, Data> {
        if (apira.resolver) {
            return apira.resolver;
        } else {
            throw new Error("Resolver is not defined");
        }
    }

    protected resolver?: Resolver<Aux, Data>;

    public path<Methods>(path: string): Paramless<Methods, Aux, Data>;
    public path<Params, Methods>(path: types.ParamfulPath<Params>): Paramful<Params, Methods, Aux, Data>;
    public path<Params>(path: types.ParamfulPath<Params> | string) {
        if (typeof path === "string") {
            return new Paramless(this, path);
        } else {
            return new Paramful(this, path);
        }
    }
}
