// app.js
const express = require('express');
const app = express();
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const port = 3000;


let questions = [
{
  "q": "This is first question",
  "o1": "option1",
  "o2": "option2",
  "o3": "option3",
  "o4": "option4",
  "c": 2
},
{
  "q": "This is second question",
  "o1": "option1",
  "o2": "option2",
  "o3": "option3",
  "o4": "option4",
  "c": 3
},
] // an array for storing questions.


let users = [] // and array for storing users.


const clients = new Set(); // To keep track of connected clients

let total_quiz_time = 60 * 10 * 100 // time in milliseconds.


// Middleware to parse JSON bodies.
app.use(express.json());

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Create a WebSocket server attached to the same HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', ws => {
  console.log('WebSocket connection established');
  clients.add(ws); // Add the new client to the set

  ws.on('message', message => {
    // console.log(`Received message: ${message}`);
   
    let {function_name, data} = JSON.parse(message);

    switch(function_name){
      case "add_user":
      {
        let user_id = addUser(data, ws);
        ws.send(user_id);
      }
      case "next_question":
        {
          let question = getNextQuestion(data);
          ws.send(JSON.stringify(question));
        }
        
    }
    ws.send(`Server received: ${JSON.stringify(users)}`);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clients.delete(ws); // Remove the client from the set
  });
});

// // Send a message to all connected clients every second
// setInterval(() => {
//   const message = 'Hello from the server';
//   clients.forEach(client => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(message);
//     }
//   });
// }, 1000); // 1000 milliseconds = 1 second



// Route for the home page.
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});





app.get('/results', (req, res)=>{
    res.send("This is a result route");
})
app.get('/next-question', (req, res)=>{
    res.send("This is a next questoin route")
})

// returns the next question as an object.
function getNextQuestion(current_question_idx){
  return questions[current_question_idx + 1];
}

// adds a user to the users array.
function addUser(user_name, user_socket){
  let name = user_name;
  let socket = user_socket;
  let id = generateRandomId();
  
  var user_obj = {
    name,
    socket,
    id
  }

  users.push(user_obj);
  return id
}


// helper function to generate a random id for a newly added user.
function generateRandomId(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  let idExists = false;
  for(let i of users){
    if((i.id) === result){
      idExists = true
    }else{
      idExists = false
    }
   
  }
  if(!idExists){
    return result
  }else{
    return generateRandomId();
  }
  
}

function getSocketFromId(id){
  
}
// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});