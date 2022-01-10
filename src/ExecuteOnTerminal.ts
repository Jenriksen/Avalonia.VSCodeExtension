import * as vscode from 'vscode';
import which from 'which';
import * as cp from "child_process";
import { ExecuteCommandResult } from './ExecuteCommandResult';

export class ExecuteOnTerminal {

    static async executeCommand(
        command: string,
        args: string[] ) {

        var fullCommand = command + " " + args.join(' ');

        const execShell = (cmd: string) =>
            new Promise<string>((resolve,  reject) => {
            cp.exec(cmd, (err, out) => {
                if (err) {
                    const result: ExecuteCommandResult = { result: false, exception: err };
                    return resolve("cmd " + err.message);
                    //or,  reject(err);
                }

                const result: ExecuteCommandResult = { result: true, exception: undefined };
                return resolve(out);
            });
        });

        return execShell(fullCommand);
    }

    static async getDotnetPath() : Promise<string | undefined> {
        var dotnetPath: string | undefined;

        await which("dotnet", (err, path) => {
            if (err === null) {
                dotnetPath = path;
            }
        });

        return dotnetPath;
    }

}