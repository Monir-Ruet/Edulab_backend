class HttpStatus extends Error {
    constructor(public status: number, public message: string) {
        super();
    }
}
export default HttpStatus;