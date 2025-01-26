import * as path from "node:path";

console.log('Happy developing ✨')
import ts, {JsxEmit, ModuleResolutionKind} from "typescript";
import fs from "fs";
import * as swc from "@swc/core"

const sourceDir = path.resolve(__dirname, "../example")
console.log('Source directory:', sourceDir);
scanDir(sourceDir);


function scanDir(sourceDir: string) {
    const sourceFiles = fs.readdirSync(sourceDir);
    sourceFiles.forEach(file => {
        const filePath = path.join(sourceDir, file);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.log(err);
            }
            if (stats.isFile()) {
                const extname = path.extname(filePath);
                if ([".ts", ".tsx"].includes(extname)) {
                    buildFile(filePath);
                    buildDts(filePath);
                }
            } else if (stats.isDirectory()) {
                scanDir(filePath);
            }
        });
    })
}

function buildFile(filePath: string) {
    const output = swc.transformSync(fs.readFileSync(filePath, 'utf8'), {
        filename: filePath,
        jsc: {
            target: "es2020",
            parser: {
                syntax: "typescript",
                tsx: true,
            },
            transform: {
                react: {
                    runtime: "classic",
                    pragma: "Vue.h",
                }
            },
        },
        outputPath: path.resolve("ddd"),
    })
    console.log(output.code)
    // console.log(output.map)
}

function buildDts(filePath: string) {
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
    }

// TypeScript 文件路径
    const tsFilePath = filePath;

    //创建一个编译器
    const compilerHost = ts.createCompilerHost(compilerOptions);

// 修改编译器Host的writeFile函数，指定输出目录
    compilerHost.writeFile = (fileName, data, writeByteOrderMark) => {
        const relativePath = path.relative(process.cwd(), fileName);
        const outputPath = path.join("dist", relativePath);
        fs.mkdirSync(path.dirname(outputPath), {recursive: true});
        fs.writeFileSync(outputPath, data, 'utf8');
    };


// 编译 TypeScript 文件
    const program = ts.createProgram([tsFilePath], compilerOptions, compilerHost);
    const emitResult = program.emit();

// 获取编译错误
    const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

    if (diagnostics.length > 0) {
        console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, ts.createCompilerHost({})));
    } else {
        console.log('Declaration file generated successfully.');
    }
}