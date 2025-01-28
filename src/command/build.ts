import * as yargs from "yargs"
import {builder} from "../builder";
import * as process from "node:process";
import fs from "fs";
import * as path from "node:path";
import * as tsNode from "ts-node"


tsNode.register({
    transpileOnly: true, // 仅进行转译，不进行类型检查
});


const buildCommand = async (argv: yargs.ArgumentsCamelCase<{ watch?: boolean }>) => {
    console.log('Hello, ' + argv.watch + '!');
    console.log(process.cwd());
    let pkg = null
    if (fs.existsSync(path.resolve(process.cwd(), "package.json"))) {
        pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"));
    }
    let vctxConfig = {};
    const vctxrcPath = path.resolve(process.cwd(), ".vctxrc");
    if (fs.existsSync(vctxrcPath)) {
        vctxConfig = JSON.parse(fs.readFileSync(vctxrcPath,"utf-8").toString());
    }
    console.log(vctxConfig);
    builder({
        cwd: process.cwd(),
        watch: argv.watch,
        pkg: pkg,
        vctxConfig: vctxConfig,
    })
}
export default buildCommand