import {IBundlessFun, TransformContext} from "./index";
import {BabelFileResult} from "@babel/core";

const babelTransformer: IBundlessFun = async (ctx: TransformContext, content: string) => {
    const {transformSync}: typeof import('@babel/core') = require('@babel/core');
    const result: BabelFileResult | null = transformSync(content, {
        filename: ctx.filePath,
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-typescript'],
        plugins: ["@vue/babel-plugin-jsx"]
    })
    return {code: result?.code || undefined};
}
export default babelTransformer