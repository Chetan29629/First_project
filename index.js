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


const CODE = 3469;
const QUIZ_CODE = 1407
let started = true // to start the quiz server.
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
  if (started) {
    console.log('WebSocket connection established');
    clients.add(ws); // Add the new client to the set

    ws.on('message', message => {
      // console.log(`Received message: ${message}`);

      let obj = JSON.parse(message);

      switch (obj.function_name) {
        case "check_code":
          {
            var res = checkEntryCode(obj.name, obj.code)
            // console.log(res)
            if (res.status === 0){
              ws.send(JSON.stringify(res))
            }else{
              ws.send(JSON.stringify(res))
            }
            break;
          }
          
        
        case "next_question":
          {
            let question = getNextQuestion(obj.data);
            if (question !== "done"){
              ws.send(JSON.stringify(question));
            }
            else{
              ws.send(JSON.stringify({status: 0}));
            }
            break;
          }

      }
      // ws.send(JSON.stringify(users));
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      clients.delete(ws); // Remove the client from the set
    });
  }else{
    
  }

});


setInterval(() => {
  if (started) {

  }

}, 1000)

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





app.get('/results', (req, res) => {
  res.send("This is a result route");
})
app.get('/next-question', (req, res) => {
  res.send("This is a next questoin route")
})

// route to start the quiz.
app.post('/start-quiz', (req, res) => {
  let code = req.query.code;
  if(code === CODE){
    started = true;
    res.status(200).send("success");
    return
  }
  res.status(200).send("incorrect code");
  
})

// checks if the entry code is correct.
function checkEntryCode(name, code, socket){
  let response = {}
  if(code == QUIZ_CODE){
    var id = addUser(name, socket)
    response.id = id
    response.status = 0
  }else{
    response.status = 1
  }
  return response
  
}
// returns the next question as an object.
function getNextQuestion(current_question_idx) {
  if (current_question_idx > questions.length - 1){
    return "done";
  }
  return questions[current_question_idx + 1];
}

// adds a user to the users array.
function addUser(user_name, user_socket) {
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
  for (let i of users) {
    if ((i.id) === result) {
      idExists = true
    } else {
      idExists = false
    }

  }
  if (!idExists) {
    return result
  } else {
    return generateRandomId();
  }

}

function getSocketFromId(id) {

}
// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});