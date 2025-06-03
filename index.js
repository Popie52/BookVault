import express, { urlencoded } from 'express';
import 'dotenv/config';
import pg from 'pg';
import path, { dirname } from "path";
import { fileURLToPath } from "url";


const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public')) 
app.use(express.urlencoded({extended: true}));


app.get("/", (req, res) => {
    res.render("index.ejs");
})



app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
})