var database, chatdb, worddb, scoredb;
var points = [];
var dButtone, doneButtone;
var isDrawing = true;
var player;
var session = "ibrahim";
var word = "potato";
var isDrawing;
var counter = 0;
var players = [];
let timer = 60;
var checkAnswer = false;
var score = 0;

function setup() {
  player = getURLParams().id;
  var s = getURLParams().s;

  players.push(player)
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDlFPNLLOezPVQzQMtV6OaCm7If_Zx4Vvo",
    authDomain: "lab-494-b4974.firebaseapp.com",
    databaseURL: "https://lab-494-b4974.firebaseio.com",
    projectId: "lab-494-b4974",
    storageBucket: "lab-494-b4974.appspot.com",
    messagingSenderId: "455668950796",
    appId: "1:455668950796:web:4837c8477221e1064b0b29",
    measurementId: "G-VSGFPEFLK4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.database().ref(session + s + '/drawings');
  chatdb = firebase.database().ref(session + s + '/chat');
  worddb = firebase.database().ref(session + s + '/worddb');
  scoredb = firebase.database().ref(session + s + '/score');

  if (player == session)
    worddb.push({ word: word });

  var chat = select(".chat");
  var chatBtnSend = document.querySelector("#btnSend");
  var inputBox = select("#inputBox");

  chatBtnSend.addEventListener("click", (e) => {
    var msg = inputBox.value();
    inputBox.value("");

    worddb.limitToLast(1).once('child_added', function (data) {
      var data = data.val();
      console.log(data.word, msg)
      if (data.word == msg) {
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
          console.log(ps)
          ps[newmsg.name] = ps[newmsg.name] + 10;
          ps[drawingPlayer] = ps[drawingPlayer] + 5;
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


  isDrawing = (session == player) ? true : false;
  database.push({ player: player, isDrawing: isDrawing, points: [] });
  if (session == player) {
    var obj = {};
    obj[player] = 0;
    scoredb.push(obj);
  }

  database.once("value", function (data) {
    //console.log(data.val());
  });

  database.on("child_added", function (data) {
    data = data.val()
    // console.log(data.next)

    if (data.start) {
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
        database.push({ next: nextPlayer });
      }
    }

    if (data.next) {
      if (player == data.next) {
        isDrawing = true;
        timer = 60;
      }
      else {
        isDrawing = false;
        timer = 60;
      }
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

  stroke(255);
  strokeWeight(8);
  noFill();

  if (frameCount % 60 == 0 && timer > 0) {
    timer--;
  }

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    line(point.x, point.y, point.px, point.py);
  }

}

function drawAndPush() {

  if (timer == 0) {
    isDrawing = false;
    clearCanvas();
  }

  if (isDrawing) {
    points.push({ x: mouseX, y: mouseY, px: pmouseX, py: pmouseY });
    database.push({ player: player, isDrawing: true, x: mouseX, y: mouseY, px: pmouseX, py: pmouseY });
  }
}

function drawAndMovedPush() {
  if (timer == 0) {
    isDrawing = false;
    clearCanvas();
  }
  if (mouseIsPressed && isDrawing) {
    drawAndPush();
  }
}

function endDrawing() {
  if (timer == 0) {
    isDrawing = false;
    clearCanvas();
  }
}

function clearCanvas() {
  points = [];
  database.remove();
  chatdb.remove();
  worddb.remove();
  database.push({ clear: true, player: player });
}


function drawButton() {
  if (player == session) {
    database.push({ start: true, player: player });
    loop(); 
  }
}