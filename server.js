require("dotenv").config({
  path: "/Users/sonjay/Desktop/projects/memory-game/backend/.env",
});
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.SERVER_PASS,
  database: "caas",
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  connection.connect();
  connection.query("SELECT * FROM highscores", (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
    res.end();
  });
});

app.post("/", (req, res) => {
  connection.connect();
  if (!req.body.data.username) {
    req.body.data.username = "guest";
  }
  connection.query(
    `INSERT INTO highscores (username,score,date) VALUES (?,?,?);`,
    [req.body.data.username, req.body.data.userScore, req.body.data.date],
    (err, row, fields) => {
      if (err) throw err;
      res.json({
        message: "Post request successfully sent",
        body: req.body.data,
      });
      res.end();
    }
  );
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
