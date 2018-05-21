export class MethodsCreator<Methods> {
    protected method = {} as Methods;

    public build(): Methods {
        return this.method;
    }
}
