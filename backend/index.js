// Create an express server that listens on port 3000
const express = require("express");
const app = express();
const PORT = 3000;

const db = require("./retool");

// Middleware to allow Express to accept JSON data
app.use(express.json());
// Middleware to allow Express to accept request from React Native
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers"
  );
  next();
});

// GET request to get all records from the database
app.get("/", (req, res) => {
  db.getRecord()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// POST request to add a record to the database
app.post("/insert", (req, res) => {
  db.addRecord(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// DELETE request to delete a record from the database
app.delete("/delete", (req, res) => {
  // console.log(req.body, "endpoint")
  db.deleteRecord(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
