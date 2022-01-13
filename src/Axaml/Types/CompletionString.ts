export class CompletionString {

    constructor(
        public name: string, 
        public comment?: string, 
        public definitionUri?: string, 
        public definitionLine?: number, 
        public definitionColumn?: number) {
    }
}