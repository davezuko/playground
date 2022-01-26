import express from "express"
import compression from "compression"

let main = async () => {
    let app = express()
    app.use(compression())
    app.use(express.static("./dist"))
    app.listen(3000, () => {
        console.log("server running at http://localhost:3000")
    })
}

main()
