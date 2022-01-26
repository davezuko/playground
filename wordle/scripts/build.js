import fs from "fs"
import util from "util"
import esbuild from "esbuild"
import copydir from "copy-dir"

let main = async () => {
    await fs.promises.rm("./dist", {recursive: true, force: true})
    let result = await esbuild.build({
        entryPoints: ["src/main.ts", "src/main.css"],
        outdir: "dist/assets",
        metafile: true,
        platform: "browser",
        format: "esm",
        target: "esnext",
        bundle: true,
        minify: true,
        splitting: false,
    })
    let text = await esbuild.analyzeMetafile(result.metafile)
    console.log(text)
    await util.promisify(copydir)("./static", "./dist")
}

main()
