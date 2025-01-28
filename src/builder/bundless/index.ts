import glob from "fast-glob"
import * as chokidar from "chokidar"
import path from "node:path";
import fs from "fs";
import _ from "lodash"
import {getDeclarations} from "./dts";
import babelTransformer from "./babel";
import ts, {CompilerOptions} from "typescript";

export type IBundlessFun = (ctx: TransformContext, content: string) => Promise<{ code?: string }>;

export interface BundlessContext {
    cwd?: string,
    watch?: boolean,
    pkg?: {
        [key: string]: any;
    },
    vctxConfig?: {
        [key: string]: any;
    }
}

export interface TransformContext {
    cwd?: string,
    watch?: boolean,
    pkg?: {
        [key: string]: any;
    },
    filePath: string,
    distFilePath: string,
}

export const bundless = async (buildContext: BundlessContext) => {
    const files = glob.globSync("**/*", {cwd: "src"})
    const config = ts.parseConfigFileTextToJson("tsconfig.json", fs.readFileSync(path.join(buildContext.cwd!, "tsconfig.json"), "utf-8")).config
    const opts = {
        cwd: buildContext.cwd, output: buildContext.vctxConfig?.output || 'dist',
        compilerOptions: ts.convertCompilerOptionsFromJson(config.compilerOptions, "").options
    }
    await transformFiles(files, opts)

    const handleTransform = (() => {

        const startTransform = _.debounce(() => {
            console.log("file", "change");
            transformFiles(files, opts)
        }, 300)
        return (filePath: string) => {
            startTransform();
        }
    })()

    if (buildContext.watch) {
        const watcher = chokidar.watch("src", {
            cwd: buildContext.cwd, ignoreInitial: true,
            awaitWriteFinish: {
                stabilityThreshold: 20,
                pollInterval: 10,
            },
        }).on("add", handleTransform).on("change", handleTransform)
    }
}

const transformFiles = async (files: string[], ops: {
    cwd?: string,
    output: string
    compilerOptions?: CompilerOptions
}) => {
    for (const file of files) {
        const filePath = path.join(ops.cwd!, "src", file)
        const sourceContent = fs.readFileSync(filePath, "utf-8");
        if ([".vue", ".js", ".jsx", ".ts", ".tsx"].includes(path.extname(file))) {
            const distFile = path.join(ops.output, path.dirname(file), path.basename(file, path.extname(file)) + ".js");
            const distFilePath = path.join(ops.cwd!, distFile)
            const parentPath = path.dirname(distFilePath);
            if (!fs.existsSync(parentPath)) {
                fs.mkdirSync(parentPath, {recursive: true});
            }
            const ctx: TransformContext = {
                cwd: ops.cwd,
                filePath: filePath,
                distFilePath: distFilePath,
            }
            babelTransformer(ctx, sourceContent).then(({code}) => {
                fs.writeFileSync(distFilePath, code!)
                console.log(`bundless ${file} to ${distFile}`);
            })
        } else {
            const distFilePath = path.join(ops.cwd!, ops.output, file)
            const parentPath = path.dirname(distFilePath);
            if (!fs.existsSync(parentPath)) {
                fs.mkdirSync(parentPath, {recursive: true});
            }
            fs.copyFile(filePath, distFilePath, (err) => {
                if (err) {
                    console.error(err);
                }
            })
        }
    }
    const tsFiles = files.filter(file => {
        return [".ts", ".tsx"].includes(path.extname(file))
    }).map(file => {
        return path.join(ops.cwd!, "src", file);
    });
    const dtsCtx = {
        outDir: ops.output,
        compilerOptions: ops.compilerOptions
    }
    getDeclarations(dtsCtx, tsFiles).then((dtsFiles) => {
        dtsFiles.forEach((dtsFile) => {
            fs.writeFileSync(path.join(ops.cwd!, dtsFile.fileName), dtsFile.content)
        })
    })
}