let host, sessionID, player; // URL params
let players = []; // players in session array
let playersCount;
let gameDB, playersDB, drawingDB, chatDB, wordDB, timerDB; // realtime databases
let isDrawing = false; // Drawing vars
let words = [];
let word = "";
let points = []; // canvas points
let lang = "en";
let timer;
let timerMax = 60;
let timerInterval;
let isFormating = false;
let answered = false;
let penwidth = 6;
let r = 0,
  g = 0,
  b = 0;

class Word {
  constructor(word) {
    this.word = word;
    this.wordText = document.querySelector(".word");
    this.wordArr = word.split("");
    this.formatedWord = this.wordArr.map((m) => "_");
    this.amount = parseInt(this.wordArr.length / 3);
  }

  renderWord() {
    if (isDrawing) {
      this.wordText.innerHTML = `<span>${this.word}</span>`;
    } else {
      if (timer >= 60) {
        this.wordText.innerHTML = `<span>${this.formatedWord.join(" ")}</span>`;
      }

      // if (timer == 60 && !isFormating) {
      //   isFormating = true;
      //   this.pickRand();
      //   this.wordText.innerHTML = this.formatedWord.join(" ");
      // }

      if (timer == 40 && !isFormating) {
        isFormating = true;
        this.pickRand();
        this.wordText.innerHTML = `<span>${this.formatedWord.join(" ")}</span>`;
      }

      if (timer == 20 && !isFormating) {
        isFormating = true;
        this.pickRand();
        this.wordText.innerHTML = `<span>${this.formatedWord.join(" ")}</span>`;
      }

      if (timer == 5 && !isFormating) {
        isFormating = true;
        this.amount -= 1;
        this.pickRand();
        this.wordText.innerHTML = `<span>${this.formatedWord.join(" ")}</span>`;
      }
    }
  }

  pickRand() {
    let count = 0;
    while (count != this.amount) {
      var rand = Math.floor(Math.random() * this.wordArr.length);
      if (this.formatedWord[rand] != this.wordArr[rand]) {
        count++;
        this.formatedWord[rand] = this.wordArr[rand];
      }
    }
  }
}
var currentWord = new Word(word);

function setup() {
  // http://localhost:3006/game?host=seerde&sessionid=1&player=seerde
  host = getURLParams().host;
  sessionID = getURLParams().sessionid;
  player = getURLParams().player;
  console.log(`Host: ${host}, Session ID: ${sessionID}, Player: ${player}`);

  // Add player to session array
  players.push(player);

  // Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDmPon15pDhh6C_-bl6p_xWQrLKx1CVFJU",
    authDomain: "project4-kharbsha.firebaseapp.com",
    databaseURL: "https://project4-kharbsha.firebaseio.com",
    projectId: "project4-kharbsha",
    storageBucket: "project4-kharbsha.appspot.com",
    messagingSenderId: "468753433035",
    appId: "1:468753433035:web:22940fba8bab5fe752364e",
    measurementId: "G-28ZBD94M21",
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Creating realtime databases
  playersDB = firebase.database().ref(host + sessionID + "/playersDB");
  drawingDB = firebase.database().ref(host + sessionID + "/drawingDB");
  timerDB = firebase.database().ref(host + sessionID + "/timerDB");
  gameDB = firebase.database().ref(host + sessionID + "/gameDB");
  wordDB = firebase.database().ref(host + sessionID + "/wordDB");
  chatDB = firebase.database().ref(host + sessionID + "/chatDB");

  //
  // PLAYERS
  /////////////////////////////////
  playersDB.once("value", (data) => {
    // get old data from database
    data = data.val();

    // tmp object to send to database later
    let tmp = {};

    // new player object
    let playerObj = {
      isDrawing: false,
      name: player,
      score: 0,
    };

    // get old data from database modify it and send it
    if (data) {
      let count = 1; // players count
      // if there is old data in database
      Object.keys(data).forEach((key, index) => {
        let player = data[key];
        tmp[`${player.name}`] = player; // copy old data to tmp
      });
      tmp[`${playerObj.name}`] = playerObj; // add the new data to old data tmp
      count = Object.keys(tmp).length; // get players count
      playersDB.update(tmp); // update players
      gameDB.update({ start: false, clear: false, loop: false, count: count }); // update players count
    } else {
      tmp[`${playerObj.name}`] = playerObj; // add new data tmp
      playersDB.set(tmp); // push data to database
      gameDB.set({ start: false, clear: false, loop: false, count: 1 }); // push players count
    }
  });
  playersDB.on("value", (data) => {
    data = data.val();
    if (data) {
      if (data.hasOwnProperty(`${player}`)) {
        isDrawing = data[`${player}`].isDrawing ? true : false;
      }
    }
  });

  //
  // CHAT
  /////////////////////////////////
  let chatDiv = select(".chat");
  let chatInp = select("#inputBox");
  let chatBtn = $("#btnSend");

  chatBtn.on("click", (e) => {
    let msg = chatInp.value();
    if (msg != "") {
      chatInp.value("");

      wordDB.limitToLast(1).once("value", (data) => {
        data = data.val();
        if (data.word == msg.toUpperCase() && !isDrawing && !answered) {
          answered = true;
          chatDB.push({
            playerName: player,
            msg: `Guessed the answer correctly!`,
            answer: true,
          });
        } else {
          chatDB.push({ playerName: player, msg: msg, answer: false });
        }
      });
    }
  });

  chatDB.on("child_added", (data) => {
    data = data.val();
    let { playerName, msg, answer } = data;

    let li = createElement("li");

    let playerNameEle = createElement("strong", playerName);
    playerNameEle.class("primary-font");
    playerNameEle.parent(li);

    let msgEle = createElement("p", msg);

    msgEle.class("message");
    msgEle.parent(li);
    li.parent(chatDiv);

    if (answer && isDrawing) {
      playersDB.once("value", (data) => {
        data = data.val();

        data[`${playerName}`].score += 10;
        data[`${player}`].score += 5;

        playersDB.update(data);
      });
    }
  });

  //
  // DRAWING
  /////////////////////////////////
  let canvasDiv = document.getElementById("canvasContainer");
  let width = canvasDiv.offsetWidth;
  let height = canvasDiv.offsetHeight;
  let canvas = createCanvas(width, height);
  canvas.mousePressed(drawKeyDown);
  canvas.mouseMoved(drawKeyDownAndMoved);
  canvas.parent("canvasContainer");
  drawingDB.on("child_added", (data) => {
    data = data.val();
    // let {px, py, x, y} = data
    // let drawingPoints = {px, py, x, y};
    // r = data.r;
    // g = data.g;
    // b = data.b;
    // penwidth = data.penwidth;
    points.push(data);
  });

  //
  // WORD
  /////////////////////////////////
  wordDB.set({ word: "" });
  wordDB.on("value", (data) => {
    data = data.val();
    word = data.word;
    currentWord = new Word(word);
    currentWord.renderWord();
    console.log(word);
  });

  //
  // TIMER
  /////////////////////////////////
  // timerDB.set({ timer: 80 });
  // timerDB.on("value", (data) => {
  //   data = data.val();
  //   timer
  // });

  //
  // GAME
  /////////////////////////////////
  gameDB.on("value", (data) => {
    data = data.val();
    if (data.start) {
      startGame();
    }
    if (data.loop) {
      console.log("started drawing");
      gameTimerController(true);
      loop();
    } else {
      console.log("stopped drawing");
      points = [];
      timer = 60;
      document.querySelector(".timer").innerHTML = `<span>${timer}</span>`;
      gameTimerController(false);
      clear();
      noLoop();
    }
  });
  $("#draw").on("click", startRound); // draw button
  $("#clear").on("click", nextRound); // clear button

  $("#black").on("click", () => pickColor(0, 0, 0));
  $("#aliceblue").on("click", () => pickColor(240, 248, 255));
  $("#gray").on("click", () => pickColor(128, 128, 128));
  $("#lightgray").on("click", () => pickColor(211, 211, 211));
  $("#darkred").on("click", () => pickColor(139, 0, 0));
  $("#brown").on("click", () => pickColor(139, 69, 19));
  $("#red").on("click", () => pickColor(255, 0, 0));
  $("#pink").on("click", () => pickColor(255, 192, 203));
  $("#orange").on("click", () => pickColor(255, 165, 0));
  $("#darkorange").on("click", () => pickColor(255, 140, 0));
  $("#yellow").on("click", () => pickColor(255, 255, 0));
  $("#khaki").on("click", () => pickColor(240, 230, 140));
  $("#green").on("click", () => pickColor(0, 128, 0));
  $("#lightgreen").on("click", () => pickColor(144, 238, 144));
  $("#lightblue").on("click", () => pickColor(30, 144, 255));
  $("#lightskyblue").on("click", () => pickColor(135, 206, 250));
  $("#blue").on("click", () => pickColor(0, 0, 255));
  $("#slateblue").on("click", () => pickColor(106, 90, 205));
  $("#purple").on("click", () => pickColor(128, 0, 128));
  $("#violet").on("click", () => pickColor(238, 130, 238));

  $("#eraser").on("click", () => pickColor(255, 255, 255));

  $("#width1").on("click", () => pickPenwidth(5));
  $("#width2").on("click", () => pickPenwidth(15));
  $("#width3").on("click", () => pickPenwidth(25));
  $("#width4").on("click", () => pickPenwidth(40));

  // stop draw() from looping
  noLoop();
}

function draw() {
  stroke(r, g, b);
  strokeWeight(penwidth);
  noFill();

  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    stroke(point.r, point.g, point.b);
    strokeWeight(point.penwidth);
    line(point.x, point.y, point.px, point.py);
  }
}

function startRound() {
  playersDB.once("value", (playersData) => {
    playersData = playersData.val();

    // get players count
    gameDB.once("value", (gameData) => {
      gameData = gameData.val();
      playersCount = gameData.count;
      // pick random player
      let rand = Math.floor(Math.random() * playersCount);
      // get player data
      let getPlayer = playersData[Object.keys(playersData)[rand]];
      // mark the player as isDrawing
      getPlayer.isDrawing = true;
      if (getPlayer.name == player) {
        isDrawing = true;
      }
      gameData.start = true;
      // update the database
      playersDB.update(playersData);
      gameDB.update(gameData);
    });
  });
}

async function startGame() {
  if (isDrawing) {
    // get 3 random words
    try {
      let wordsArry = await axios.get(`/api/word/${lang}/random/1/1/1`);
      words = wordsArry.data.randomWords;
    } catch (err) {
      console.log(err);
    }
    renderWordsBtn();
  }
}

function renderWordsBtn() {
  let gameScreen = $("#canvasContainer");
  gameScreen.css("position", "relative");
  gameScreen.append("<div class='words__btn'></div>");

  let wordsBtn = $(".words__btn");
  wordsBtn.css({
    display: "flex",
    justifyContent: "space-around",
    position: "absolute",
    width: "80%",
    top: "50%",
    left: "20px",
    color: "red",
  });

  words.forEach((e) => {
    wordsBtn.append(`<div class='word__btn'>${e}</div>`);
  });

  $(".word__btn").css({
    fontSize: "24px",
    color: "white",
    backgroundColor: "rgba(25, 26, 35, 0.7)",
  });

  $(".word__btn").on("click", (e) => {
    word = e.target.innerHTML;
    $(".words__btn").remove();
    // database.push({ start: true, player: player, word: word });
    gameDB.once("value", (data) => {
      data = data.val();
      data.loop = true;
      data.start = false;
      gameDB.update(data);
    });
    wordDB.update({ word: word.toUpperCase() });
  });
}

function nextRound() {
  drawingDB.remove();
  chatDB.remove();
  gameDB.once("value", (gameData) => {
    gameData = gameData.val();
    gameData.loop = false;
    gameDB.update(gameData);

    playersDB.once("value", (playersData) => {
      playersData = playersData.val();
      let tmpIndex = 0;
      Object.keys(playersData).forEach((key, index) => {
        if (playersData[key].isDrawing) {
          playersData[key].isDrawing = false;
          tmpIndex = index == gameData.count - 1 ? 0 : index + 1;
        }
      });
      let getPlayer = playersData[Object.keys(playersData)[tmpIndex]];
      getPlayer.isDrawing = true;
      if (getPlayer.name == player) {
        isDrawing = true;
      }
      gameData.start = true;
      playersDB.update(playersData);
      gameDB.update(gameData);
    });
  });
}

function drawKeyDown() {
  if (isDrawing) {
    points.push({
      x: mouseX,
      y: mouseY,
      px: pmouseX,
      py: pmouseY,
      r,
      g,
      b,
      penwidth,
    });
    drawingDB.push({
      x: mouseX,
      y: mouseY,
      px: pmouseX,
      py: pmouseY,
      r,
      g,
      b,
      penwidth,
    });
  }
}

function drawKeyDownAndMoved() {
  if (mouseIsPressed && isDrawing) {
    drawKeyDown();
  }
}

function gameTimerController(state) {
  if (state) {
    console.log("started time", timerInterval);
    let start = new Date();
    timerInterval = setInterval(() => {
      let currentTime = new Date();
      let count = +currentTime - +start;
      let seconds = Math.floor(count / 1000) % 60;
      timer = timerMax - seconds;
      isFormating = false;
      document.querySelector(".timer").innerHTML = `<span>${timer}</span>`;
      currentWord.renderWord();
      if (timer == 1) {
        clearInterval();
        if (isDrawing) {
          nextRound();
        }
      }

      // if (timer > 0) {
      //   timer--;
      //   isFormating = false;
      //   document.querySelector(".timer").innerHTML = timer;
      //   currentWord.renderWord();
      // } else {
      //   if (isDrawing) {
      //   }
      // }
    }, 1000);
  } else {
    console.log("stoped time", timerInterval);
    clearInterval(timerInterval);
  }
}

function pickColor(newR, newG, newB) {
  console.log("test");
  r = newR;
  g = newG;
  b = newB;
}
function pickPenwidth(newPenwidth) {
  console.log("tttt");
  penwidth = newPenwidth;
}
