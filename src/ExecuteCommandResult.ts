import { ExecException } from "child_process";

export class ExecuteCommandResult
{
    readonly result: boolean;
    readonly exception?: ExecException;

    constructor(result: boolean, exception: ExecException)  {
        this.result = result;
        this.exception = exception;
    }
}