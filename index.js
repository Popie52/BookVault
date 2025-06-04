import express, { urlencoded } from 'express';
import 'dotenv/config';
import pg from 'pg';
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import axios from 'axios';


const app = express();
const PORT = process.env.PORT || 3000;
const URL = process.env.URL;
const __dirname = dirname(fileURLToPath(import.meta.url));
const db= new pg.Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: 5432,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    ssl: {
    rejectUnauthorized: false          
  }
})

db.connect().then(() => console.log("Connected to Render Postgres!"))
  .catch(err => console.error("Connection error", err));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static('public')) 
app.use(express.urlencoded({extended: true}));


let usersData = [];

async function getUserData() {
    const result = await db.query("select * from books");
    usersData = result.rows;
}

app.get("/", async (req, res) => {
    await getUserData();
    res.render("index.ejs", {usersData});
});


app.get('/edit/:id', async (req, res) => {
  const id = req.params.id;
  
  await getUserData();

  const book = usersData.find(item => item.id == id);
  if (!book) return res.status(404).send('Not found');
  
  res.render('edit', { book });
});

app.post("/add", async (req, res) => {
    const { title, author, rate, date, notes } = req.body;
    let coverUrl = 'https://imgs.search.brave.com/o7ZR60IpqVB8S9R4awVuiMHkiwZEi0ikq9RmGvFLGHM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS12/ZWN0b3IvaW1hZ2Ut/bm90LWZvdW5kLWdy/YXlzY2FsZS1waG90/by0yNjBudy0xNzM3/MzM0NjMxLmpwZw';
    try {

        const {data} = await axios.get(URL, {
            params: {q: `${title} ${author}`}
        });

        const book = data.docs.find(doc => doc.cover_i);
        if(book) {
            coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        }
        const result = await db.query('insert into books (book_cover, title, author, rating, date_read, description) values($1, $2, $3, $4, $5, $6)', [coverUrl, title, author,  parseInt(rate), date, notes]);
        
        res.redirect("/");
    } catch(e) {
        console.log(e.message);
        res.status(404).send("<h1>Not Found<h1>");
    }
        
})

app.post('/delete', async (req, res) => {
    const {id} = req.body;
    try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("<h1>Id Not Found</h1>");
    }

    await db.query("DELETE FROM books WHERE id = $1", [id]);
    res.redirect("/");
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).send("<h1>Internal Server Error</h1>");
  }
})



app.post("/edit/:id", async (req, res) =>  {
    const id = req.params.id;
    const {title, author, date, rate, notes} = req.body;
    try {
        const detail = await db.query('select * from books where id = $1', [id]);
        if(detail.rows.length == 0) return res.status(404).send("<h1>Id Not Found</h1>");
        
        await db.query('update books set title=$1, author=$2, date_read=$3, rating=$4, description=$5 where id = $6;',[title, author, date,rate, notes, id]);

        res.redirect("/");

    } catch(e) {
        console.log(`${e.message}`);
    }

})

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
})