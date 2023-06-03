require('dotenv').config();
// const BASEURI=process.env.BASEURI
const dbconnect=require("./db");
const express = require('express');
const router = require("./routes/auth")
const cors=require("cors")
dbconnect();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())
app.post('/', (req, res) => {
  res.send('Hello World!')
})
//Avaible routes

app.use("/api/auth",require("./routes/auth"));
app.use("/api/notes",require("./routes/notes"));
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

