const mainLoader = document.getElementById('mainLoader');
const bodyContainer = document.getElementById('bodyContainer');


let socket;
// establishWebSocketConnection();

let details_container = `<div class="container">
 <div class="quizDetailsContainer">
            <div class="welcome">
                <h1>Welcome to Orientation Quiz</h1>
               
            </div>
            <div class="quizDetails">
                <input type="text" id="nameInput" placeholder="Enter your name" required>
            </div>

            <div class="quizDetails">
                <input type="number" id="nameInput" placeholder="Enter Quiz Code" required>
            </div>
            <div class="start-button">
                <button type="button" id="startButton">Start Quiz</button>
        
        </div>
        </div>`

let question_container = `
<div class="container">
<div class="questionContainer">
            <div class="timer">
                00:00
             </div>
             <div class="question">
                 What is the capital of France?
             </div>
             <div class="options">
                 <label><input type="radio" name="option" value="a"> Paris</label>
                 <label><input type="radio" name="option" value="b"> London</label>
                 <label><input type="radio" name="option" value="c"> Berlin</label>
                 <label><input type="radio" name="option" value="d"> Madrid</label>
             </div>
             <div class="next-button">
                 <button type="button">Next</button>
             </div>
        </div>
        </div>`

let leaderboard_body_container = `<div class="leaderBoardContainer">
            <h1>Leaderboard</h1>
            <div class="leaderboard">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody id="table_body">
                    
                    </tbody>
                </table>
            </div>
        </div>
`

let winner_body_container = `<div class="winner-section">
            <h1 id="congrats">Congratulations to Our First Position Holder!</h1>
            <p>As a token of appreciation, here is a special coupon code just for you:</p>
            <p>Click Given Code to copy it.</p>
                <button type="button" class="couponcode">CODE1234</button>
            <p>Use this code at Zomato to enjoy your reward!</p>
        </div>`

showMainLoader(false);

function validateDetails() {
    showMainLoader(true)
    let name = document.getElementById("nameInput").value;
    let code = document.getElementById("codeInput").value;

    if (name !== "" && code !== "") {
        establishWebSocketConnection(name, code);
    } else {
        alert("No entries are allowed to be empty!");
    }
}

function establishWebSocketConnection(name, code) {
    socket = new WebSocket("ws://localhost:3000")
    socket.addEventListener('open', (event) => {
        console.log("connected to the server!");
        socket.send(JSON.stringify({ function_name: "check_code", name, code }));
        socket.addEventListener('message', (event) => {
            let response = JSON.parse(event.data);
            // console.log(response.status)
            switch (response.status) {
                case 1: {
                    console.log("casleld 1")
                    let name = document.getElementById("nameInput");
                    let code = document.getElementById("codeInput");
                    name.value = "";
                    code.value = "";
                    alert("Incorrect code!")
                    break;
                }
                case 0: {
                    onCodeCorrect();
                    break;
                }
            }
            console.log(event)
        })
    })
}

function onCodeCorrect(){
    showMainLoader(false)
    bodyContainer.innerHTML = question_container;
}


// function to toggle the display of the main loader.
function showMainLoader(show) {
    if (show) {
        mainLoader.style.display = 'block';
    } else {
        mainLoader.style.display = 'none';
    }
}