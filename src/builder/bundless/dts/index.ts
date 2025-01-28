import ts, {CompilerOptions} from "typescript";

export interface DtsContext {
    outDir: string;
    compilerOptions?: CompilerOptions
}

export const getDeclarations = async (ctx: DtsContext, files: string[]): Promise<{
    fileName: string,
    content: string
}[]> => {
    const output: { fileName: string, content: string }[] = []

    const compilerOptions = Object.assign({}, ctx.compilerOptions, {
        outDir: ctx.outDir,
    })


    //创建一个编译器
    const compilerHost = ts.createCompilerHost(compilerOptions);

// 修改编译器Host的writeFile函数，指定输出目录
    compilerHost.writeFile = (fileName, data, writeByteOrderMark) => {
        output.push({fileName: fileName, content: data});
    };


// 编译 TypeScript 文件
    const program = ts.createProgram(files, compilerOptions, compilerHost);
    const emitResult = program.emit();

// 获取编译错误
    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    if (diagnostics.length > 0) {
        console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, ts.createCompilerHost({})));
    } else {
        console.log('Declaration file generated successfully.');
    }

    return output
}