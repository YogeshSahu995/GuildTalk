import {server} from "./src/app.js"
import { connectDB } from "./src/db/connectDB.js"

const PORT = process.env.PORT

connectDB()
.then(() => {
    server.listen(PORT, () => {
        console.log(`app is listening on ${PORT}`)
    })
})
.catch((error) => {
    console.error(`Error: ${error}`)
})
