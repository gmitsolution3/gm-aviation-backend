declare module "http-status" {
  interface HttpStatusWithNumericIndex {
    [key: number]: string;
    [key: string]: any;
  }

  const status: HttpStatusWithNumericIndex;
  export default status;
}
