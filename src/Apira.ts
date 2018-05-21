import { Paramful } from "./core/Paramful";
import { Paramless } from "./core/Paramless";
import { Resolver } from "./core/Resolver";
import * as types from "./typings";

export class Apira<Aux = void> {
    public static setResolver<Aux>(resolver: Resolver<Aux>, apira: Apira<Aux>) {
        apira.resolver = resolver;
    }

    public static getResolver<Aux>(apira: Apira<Aux>): Resolver<Aux> {
        if (apira.resolver) {
            return apira.resolver;
        } else {
            throw new Error("Resolver is not defined");
        }
    }

    protected resolver?: Resolver<Aux>;

    public path<Methods>(path: string): Paramless<Methods, Aux>;
    public path<Params, Methods>(path: types.ParamfulPath<Params>): Paramful<Params, Methods, Aux>;
    public path<Params>(path: types.ParamfulPath<Params> | string) {
        if (typeof path === "string") {
            return new Paramless(this, path);
        } else {
            return new Paramful(this, path);
        }
    }
}
