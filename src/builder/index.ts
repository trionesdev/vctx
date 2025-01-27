export interface BuilderOpts {
    cwd?: string;
    pkg?: {
        [key: string]: any;
    };
    watch?: boolean
}

export const builder = (ops: BuilderOpts): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
    })
}