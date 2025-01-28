import * as yargs from "yargs"
import buildCommand from "../command/build";

export async function run(){
    const argv = yargs
        .command('build', 'build', (yargs) => {
            return yargs.option('watch', {
                alias: 'w',
                describe: 'watch mode',
                demandOption: false,
                type: "boolean",
            });
        }, buildCommand)
        .help()
        .argv;
}

run()