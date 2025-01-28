import ts, {JsxEmit, ModuleResolutionKind} from "typescript";

export const getDeclarations = async (files:string[],outDir:string):Promise<{fileName:string,content:string}[]> => {
    const output:{fileName:string,content:string}[] = []
    let compilerOptions = {};
    compilerOptions = {
        target: ts.ScriptTarget.ES2016,
        module: ts.ModuleKind.CommonJS,
        "moduleResolution": ModuleResolutionKind.Node10,
        "esModuleInterop": true,
        "strict": true,
        "skipLibCheck": true,
        jsx: JsxEmit.Preserve,
        jsxImportSource: "vue",
        declaration: true,
        emitDeclarationOnly: true,
        outDir:outDir
    }


    //创建一个编译器
    const compilerHost = ts.createCompilerHost(compilerOptions);

// 修改编译器Host的writeFile函数，指定输出目录
    compilerHost.writeFile = (fileName, data, writeByteOrderMark) => {
        // const relativePath = path.relative(path.join(process.cwd(),"src"), fileName);
        // const outputPath = path.join("dist", relativePath);
        // // fs.mkdirSync(path.dirname(outputPath), {recursive: true});
        // // fs.writeFileSync(outputPath, data, 'utf8');
        output.push({fileName:fileName,content:data});
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