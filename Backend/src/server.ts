import app from "./app";
import dotenv from "dotenv";
import connectionDB from "./config/db";


dotenv.config();

const PORT = 8000;

connectionDB();

app.listen(PORT, ()=>{
    console.log(`server is listening on http://localhost:${PORT} `)
});