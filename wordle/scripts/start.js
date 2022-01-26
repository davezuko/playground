import esbuild from "esbuild"

let main = async () => {
    let server = await esbuild.serve(
        {
            servedir: "static",
            port: 3000,
        },
        {
            entryPoints: ["src/main.ts", "src/main.css"],
            outdir: "static/assets",
            platform: "browser",
            format: "esm",
            target: "esnext",
            bundle: true,
            minify: false,
            splitting: false,
        },
    )
    console.log("server running at http://localhost:%s", server.port)
}

main()
