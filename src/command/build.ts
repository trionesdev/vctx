import * as yargs from "yargs"
import {builder} from "../builder";
import * as process from "node:process";
import fs from "fs";
import * as path from "node:path";


const buildCommand = async (argv: yargs.ArgumentsCamelCase<{ watch?: boolean }>) => {
    console.log('Hello, ' + argv.watch + '!');
    console.log(process.cwd());
    let pkg = null
    if (fs.existsSync(path.resolve(process.cwd(), "package.json"))) {
        pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"));
    }
    let vctxConfig = {};
    if (fs.existsSync(path.resolve(process.cwd(), "vctxrc.ts"))) {
       const vctxrc = await import(path.resolve(process.cwd(), "vctxrc.ts"))
        vctxConfig = vctxrc.default || vctxrc;
    }
    builder({
        cwd: process.cwd(),
        watch: argv.watch,
        pkg: pkg,
        vctxConfig: vctxConfig,
    })
}
export default buildCommand