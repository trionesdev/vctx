import * as yargs from "yargs"
import {builder} from "../builder";
import * as process from "node:process";


const buildCommand=(argv:yargs.ArgumentsCamelCase)=>{
    console.log('Hello, ' + argv.watch + '!');
    console.log(process.cwd());
    // builder({
    //     cwd:"",
    //     watch:argv.watch
    // })
}
export default buildCommand