import glob from "fast-glob"
import swcTransformer from "./swc";
import path from "node:path";
import fs from "fs";
import {getDeclarations} from "./dts";
import ts from "typescript";

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
    console.log(files)
    transformFiles(files, {cwd: buildContext.cwd})

}

const transformFiles = (files: string[], ops: {
    cwd?: string,
}) => {
    for (const file of files) {
        const filePath = path.join(ops.cwd!, "src", file)
        const sourceContent = fs.readFileSync(filePath, "utf-8");
        if ([".ts", ".tsx"].includes(path.extname(file))) {
            console.log(path.dirname(file ));
            const distFilePath = path.join(ops.cwd!, "dist", path.dirname(file),path.basename(file, path.extname(file)) + ".js")
            const parentPath = path.dirname(distFilePath);
            if (!fs.existsSync(parentPath)) {
                fs.mkdirSync(parentPath, {recursive: true});
            }
            const ctx: TransformContext = {
                cwd: ops.cwd,
                filePath: filePath,
                distFilePath: distFilePath,
            }
            console.log(ctx)
            swcTransformer(ctx, sourceContent).then(({code}) => {
                fs.writeFileSync(distFilePath, code!)
            })
        }
    }
    const tsFiles = files.filter(file => {
        return [".ts", ".tsx"].includes(path.extname(file))
    }).map(file => {
        return path.join(ops.cwd!,"src", file);
    });
    getDeclarations(tsFiles).then((dtsFiles)=>{
        dtsFiles.forEach((dtsFile) => {
            fs.writeFileSync(path.join(ops.cwd!,dtsFile.fileName),dtsFile.content)
        })
    })
}