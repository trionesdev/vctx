import {IBundlessFun, TransformContext} from "./index";

const swcTransformer: IBundlessFun = async (ctx:TransformContext,content: string) => {
    const {transform}: typeof import('@swc/core') = require('@swc/core');

    const {code} = await transform(content, {
        jsc: {
            target: "es2020",
            parser: {
                syntax: "typescript",
                tsx: true,
            },
            transform: {
                react: {
                    runtime: "classic",
                    pragma: "Vue.h",
                }
            },
        },
    });
    console.log(code);
    return {code};
}
export default swcTransformer;