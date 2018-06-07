// tslint:disable:no-any
export namespace HttpErrorMessage {
  export const INVALID_DATA = (data: any, name: any) => {
    return `Invalid data ${data} of parameter ${name}!`;
  };
  export const MISSING_REQUIRED = (name: any) => {
    return `Required parameter ${name} is missing!`;
  };
}
