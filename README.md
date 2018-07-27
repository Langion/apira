# Apira

API strict type definition creator. This library is aimed to allow you to define API with strict types using TypeScript. 
## First you need API Builder

    import {Apira} from "@langion/apira";
    export const api = new Apira();
After that you need to define method that makes request. There is an abstract class `Resolver` from `@langion/apira` and you need to extend it and set resolver to `api`. The  `request` method is used to perform every request.

    export class ServiceRequest extends Resolver<void> {
        protected basePath = "http://localhost:8090";
    
        protected request: <Response, Query, Payload, Params>(data: RequestData<Query, Payload, Params, void>) => Promise<Response> = (data) => {
            const request = fetch(data.url, {
                method: data.method,
                body: JSON.stringify(data.request.payload),
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });
    
            const result = request.then((v) => v.json()).catch((e) => console.log(e));
    
            return result.then((v) => {
                console.log(v);
                return v;
            });
        }
    }
And now you need to assign resolver to `api`.

    import { Apira } from  "@langion/apira";
    Apira.setResolver(new ServiceRequest(), api);

## Define API
There are two types of definitions:
Without params in path:

    export const getAllData = api.path(Url)
	    .request<ResponseType, QueryType, PayloadType>(RequestMethod)
	    .build();
For example:

    interface Data {
      state: string;
      permissions: number[];
    }
    
    interface Filter {
      search: string;
      status: string
    }
    
    export const getAllData = api.path('/api/data')
        .request<Data, Filter, void>('get')
        .build();

With params in path:  

    export const getUser = api.path((p: ParamsType) => Url)
	    .request<ResponseType, QueryType, PayloadType>(RequestMethod)
	    .build();
For example:

    interface User {
        name: string;
        lastName: string;
    }
    
    interface Params {
        id: number;
    }
    
    export const getUser = api
        .path((p: Params) => `/api/user/${p.id}`)
        .request<User, void, void>('get')
        .build();
When you defined API methods you can call this methods:

    getAllData({ payload: null, query: { search: 'last', status: 'done' } }).then(r => {
        console.log(r.permissions);
        console.log(r.state);
    });
    
    getUser({ params: { id: 23 }, query: null, payload: null }).then(r => {
        console.log(r.name);
        console.log(r.lastName);
    });

