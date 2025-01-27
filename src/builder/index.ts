import {bundless} from "./bundless";


export interface BuildContext{
    cwd?: string;
    pkg?: {
        [key: string]: any;
    },
    watch?: boolean
    vctxConfig?:any
}

export const builder = (ctx: BuildContext) => {
    bundless(ctx)
}