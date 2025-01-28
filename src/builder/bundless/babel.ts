import {IBundlessFun, TransformContext} from "./index";

const babelTransformer: IBundlessFun = async (ctx: TransformContext, content: string) => {
    const {transformSync}: typeof import('@babel/core') = require('@babel/core');
    const {code} =  transformSync(content, {
        filename:ctx.filePath,
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-typescript'],
        plugins: ["@vue/babel-plugin-jsx"]
    })
    return {code};
}
export default babelTransformer