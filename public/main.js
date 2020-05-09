var database, chatdb, worddb, scoredb;
var points = [];
var dButtone, doneButtone;
var isDrawing = true;
var player;
var playingPlayer;
var session = "ibrahim";
var word = "potato";
var isDrawing;
var counter = 0;
var players = [];
let timer = 60;
var checkAnswer = false;
var score = 0;
var isCounting = false
var answered = false
var isFormating = false;

class Word{
  constructor(word){
    this.word = word;
    this.wordText = document.querySelector(".word");
    this.wordArr = word.split("");
    this.formatedWord = this.wordArr.map(m => "_");
    this.amount = parseInt(this.wordArr.length / 3);
  }
  renderWord() {
    if(playingPlayer == player){
      this.wordText.innerHTML = this.word
    }
    else{
      if(timer == 60){
        this.wordText.innerHTML = this.formatedWord.join(" ");
      }
  
      if(timer == 40 && !isFormating){
        isFormating = true;
        this.pickRand()
        this.wordText.innerHTML = this.formatedWord.join(" ");
      }
  
      if(timer == 20 && !isFormating){
        isFormating = true;
        this.pickRand()
        this.wordText.innerHTML = this.formatedWord.join(" ");
      }
  
      if(timer == 5 && !isFormating){
        isFormating = true;
        this.amount -= 1
        this.pickRand()
        this.wordText.innerHTML = this.formatedWord.join(" ");
      }
    }
  }

  pickRand(){
    let count = 0
    while(count != this.amount){
      var rand = Math.floor(Math.random() * this.wordArr.length);
      if(this.formatedWord[rand] != this.wordArr[rand]){
        count++;
        this.formatedWord[rand] = this.wordArr[rand];
      }
    }
  }
}
var currentWord = new Word(word);

// axios.get("/api/word/en/all").then(res => {console.log(res)}).catch(err => {})

async function setup() {
  // http://localhost:3005/game?session=<host_name>&id=<player_name>&s=<session_id>
  session = getURLParams().session;
  player = getURLParams().id;
  var s = getURLParams().s;

  players.push(player)
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDmPon15pDhh6C_-bl6p_xWQrLKx1CVFJU",
    authDomain: "project4-kharbsha.firebaseapp.com",
    databaseURL: "https://project4-kharbsha.firebaseio.com",
    projectId: "project4-kharbsha",
    storageBucket: "project4-kharbsha.appspot.com",
    messagingSenderId: "468753433035",
    appId: "1:468753433035:web:22940fba8bab5fe752364e",
    measurementId: "G-28ZBD94M21"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();

  database = firebase.database().ref(session + s + '/drawings');
  chatdb = firebase.database().ref(session + s + '/chat');
  worddb = firebase.database().ref(session + s + '/worddb');
  scoredb = firebase.database().ref(session + s + '/score');

  // if (player == session)
  //   worddb.push({ word: word });

  var chat = select(".chat");
  var chatBtnSend = document.querySelector("#btnSend");
  var inputBox = select("#inputBox");

  isDrawing = (session == player) ? true : false;
  database.push({ player: player, isDrawing: isDrawing, points: [] });
  if (session == player) {
    var obj = {};
    obj[player] = 0;
    scoredb.push(obj);
  }

  chatBtnSend.addEventListener("click", (e) => {
    var msg = inputBox.value().toLowerCase();
    inputBox.value("");

    worddb.limitToLast(1).once('child_added', function (data) {
      var data = data.val();
      console.log(data.word, msg)
      if (data.word == msg && !isDrawing && !answered) {
        answered = true;
        chatdb.push({ name: player, msg: "correct!", answer: true });
      } else {
        chatdb.push({ name: player, msg: msg, answer: false });
      }
    });
  });

  chatdb.on("child_added", function (data) {
    var newmsg = data.val();
    console.log(newmsg);

    if (player == session) {
      console.log('score')
      console.log(newmsg)
      if (newmsg.answer) {

        var drawingPlayer;

        database.limitToLast(1).once("child_added", function (ps) {
          var ps = ps.val();
          drawingPlayer = ps.player;
        });

        scoredb.limitToLast(1).once("child_added", function (ps) {
          var ps = ps.val();
          ps[newmsg.name] = ps[newmsg.name] + 10;
          ps[drawingPlayer] = ps[drawingPlayer] + 5;
          console.log("test",ps)
          scoredb.push(ps);
        });
      }
    }

    var li = createElement('li');

    var nameEle = createElement('strong', newmsg.name);
    nameEle.class("primary-font");
    nameEle.parent(li);

    var msgEle = createElement('p', newmsg.msg);

    msgEle.class("message");
    msgEle.parent(li);
    li.parent(chat);
  });

  database.on("child_added", async function (data) {
    data = data.val()
    // console.log(data.next)

    if(data.word){
      word = data.word
      currentWord = new Word(word);
    }

    if (data.start) {
      gameTimerController(true);
      loop();
    }

    if (data.player != player && data.player != undefined) {
      if (!players.includes(data.player)) {
        players.push(data.player);
        if (player == session) {
          scoredb.limitToLast(1).once("child_added", function (ps) {
            var ps = ps.val();
            ps[data.player] = 0;
            scoredb.push(ps);
          });
        }
      }
    }

    if (!data.clear) {
      points.push(data);
    } else {
      points = [];
      if (data.player == player) {
        isDrawing = true;
      } else {
        isDrawing = false;
      }
      if (player == session) {
        var nextPlayer = players[counter++ % players.length]
        database.push({player: player, next: nextPlayer });
      }
    }

    if (data.next) {
      playingPlayer = data.next
      if (player == data.next) {
        isDrawing = true;
        console.log(isDrawing);
        if(timer == 0){
          chooseWords();
        }
        // timer = 60;
      }
      else {
        isDrawing = false;
        console.log(isDrawing);
        // timer = 60;
      }
    }
    if(data.check){
      timer = 60;
      loop();
    }
  });

  var canvas = createCanvas(400, 400);
  canvas.mousePressed(drawAndPush);
  canvas.mouseMoved(drawAndMovedPush);
  canvas.mouseReleased(endDrawing)
  canvas.parent("canvasContainer");

  var clearButton = document.querySelector("#clear");
  clearButton.addEventListener("click", clearCanvas);

  dButtone = document.querySelector("#draw");
  dButtone.addEventListener("click", drawButton);

  noLoop();
}

function draw() {
  background(0);

  stroke(255);
  strokeWeight(1);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(timer, 30, 30);

  currentWord.renderWord()

  if(timer == 0){
    clearCanvas();
  }

  stroke(255);
  strokeWeight(8);
  noFill();

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    line(point.x, point.y, point.px, point.py);
  }
}

function drawAndPush() {

  // if (timer == 0) {
  //   isDrawing = false;
  //   clearCanvas();
  // }

  if (isDrawing) {
    points.push({ x: mouseX, y: mouseY, px: pmouseX, py: pmouseY });
    database.push({ player: player, isDrawing: true, x: mouseX, y: mouseY, px: pmouseX, py: pmouseY });
  }
}

function drawAndMovedPush() {
  // if (timer == 0) {
  //   isDrawing = false;
  //   clearCanvas();
  // }
  if (mouseIsPressed && isDrawing) {
    drawAndPush();
  }
}

function endDrawing() {
  // if (timer == 0) {
  //   gameTimerController(false);
  //   isDrawing = false;
  //   clearCanvas();
  // }
}

async function clearCanvas() {
  noLoop();
  timer = 0;
  answered = false;
  if(player == session){
    // timer = 60;
    gameTimerController(false);
    points = [];
    database.remove();
    chatdb.remove();
    worddb.remove();

    try {
      let words = await axios.get("/api/word/en/random/1");
      word = words.data.randomWords[0];
    } catch (err) {
      console.log(err);
    }

    database.push({ clear: true, player: player, word: word });
    worddb.push({ word: word.toLowerCase() });
    answered = false;
  }
}


async function drawButton() {
  if (player == session) {
    try {
      let words = await axios.get("/api/word/en/random/1");
      word = words.data.randomWords[0];
    } catch (err) {
      console.log(err);
    }

    var wordsArry;
    try {
      let words = await axios.get("/api/word/en/random/1/1/1");
      wordsArry = words.data.randomWords;
    } catch (err) {
      console.log(err);
    }

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
      color: "red"
    });

    wordsArry.forEach(e => {
      wordsBtn.append(`<div class='word__btn'>${e}</div>`)
    })

    $(".word__btn").css({
      fontSize: "24px",
      color: "white",
      backgroundColor: "rgba(25, 26, 35, 0.7)"
    })

    $(".word__btn").on("click", (e) => {
      word = e.target.innerHTML;
      database.push({ start: true, player: player, word: word});
      worddb.push({ word: word.toLowerCase() });
      $(".words__btn").remove();
    })

    // database.push({ start: true, player: player, word: word});
    // worddb.push({ word: word.toLowerCase() });
    // loop();
  }
}

async function chooseWords(){
  var wordsArry;
  try {
    let words = await axios.get("/api/word/en/random/1/1/1");
    wordsArry = words.data.randomWords;
  } catch (err) {
    console.log(err);
  }

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
    color: "red"
  });

  wordsArry.forEach(e => {
    wordsBtn.append(`<div class='word__btn'>${e}</div>`)
  })

  $(".word__btn").css({
    fontSize: "24px",
    color: "white",
    backgroundColor: "rgba(25, 26, 35, 0.7)"
  })

  $(".word__btn").on("click", (e) => {
    word = e.target.innerHTML;
    database.push({ check: true, word: word, player: player});
    worddb.push({ word: word.toLowerCase() });
    $(".words__btn").remove();
  })
}

function gameTimerController(state){
  let timerInterval;
  if(state){
    timerInterval = setInterval(gameTimer, 100);
  }
  else{
    clearInterval(timerInterval)
  }
}

function gameTimer(){
  if (timer > 0) {
    timer--;
    isFormating = false;
  }
}

function renderWord(){
  let wordText = document.querySelector(".word");
  let wordArr = word.split("");
  let formatedWord = wordArr.map(m => "_");
  let amount = parseInt(wordArr.length / 3)

  if(playingPlayer == player){
    wordText.innerHTML = word
  }
  else{
    if(timer == 60){
      wordText.innerHTML = formatedWord.join(" ");
    }

    if(timer == 40 && !isFormating){
      isFormating = true;
      pickRand()
      wordText.innerHTML = formatedWord.join(" ");
    }

    if(timer == 20 && !isFormating){
      isFormating = true;
      pickRand()
      wordText.innerHTML = formatedWord.join(" ");
    }

    if(timer == 5 && !isFormating){
      isFormating = true;
      amount -= 1
      pickRand()
      wordText.innerHTML = formatedWord.join(" ");
    }
  }

  function pickRand(){
    let count = 0
    while(count != amount){
      var rand = Math.floor(Math.random() * wordArr.length);
      if(formatedWord[rand] != wordArr[rand]){
        count++;
        formatedWord[rand] = wordArr[rand];
      }
    }
  }
}