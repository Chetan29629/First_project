// app.js
const express = require('express');
const app = express();
const port = 3000;


let questions = [] // an array for storing questions.
let users = [] // and array for storing users.


// Middleware to parse JSON bodies
app.use(express.json());

// Route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Route for the about page
app.get('/about', (req, res) => {
  res.send('This is the About Page!');
});

// Route for the contact page
app.get('/contact', (req, res) => {
  res.send('Contact us at contact@example.com.');
});

app.get('/results', (req, res)=>{
    res.send("This is a result route");
})
app.get('/next-question', (req, res)=>{
    res.send("This is a next questoin route")
})

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});