import * as yargs from "yargs"
import buildCommand from "../command/build";

// 主命令及子命令的定义
const argv = yargs
    .command('build', 'build', (yargs) => {
        return yargs.option('watch', {
            alias: 'w',
            describe: 'watch mode',
            demandOption: false,
            type: "boolean"
        });
    }, buildCommand)
    .help()
    .argv;

// yargs.parse()