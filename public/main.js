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

var penwidth = 1; //default
var pen = 1; //defalut:line
var r = 0,
  g = 0,
  b = 0; //color default:black

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

  var canvas = createCanvas(600, 600);
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
  background(255);

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

  fill(0);
  stroke(0);
  strokeWeight(1);
  textSize(20);
  noFill();
  rect(0, 20, 20, 20);
  rect(0, 40, 20, 20);
  rect(0, 60, 20, 20);
  rect(0, 80, 20, 20);
  rect(0, 100, 20, 20);
  rect(0, 120, 20, 20);
  fill(255, 0, 0); //red
  rect(0, 200, 20, 20);
  fill(255, 128, 0); //orange
  rect(0, 220, 20, 20);
  fill(255, 255, 0); //yellow
  rect(0, 240, 20, 20);
  fill(0, 255, 0); //green
  rect(0, 260, 20, 20);
  fill(0, 255, 255); //blue
  rect(0, 280, 20, 20);
  fill(0, 64, 128); //indigo
  rect(0, 300, 20, 20);
  fill(128, 0, 128); //purple
  rect(0, 320, 20, 20);
  fill(0); //purple
  rect(0, 340, 20, 20);

  noFill();
  rect(0, 530, 20, 20);
  rect(0, 550, 20, 20);
  rect(0, 570, 20, 20);
  stroke(r, g, b);
  fill(r, g, b);
  //shapes
  line(4, 24, 16, 36);
  ellipse(10, 50, 16, 12);
  rect(3, 64, 14, 12);
  fill(228, 160, 140);
  stroke(0);
  ellipse(10, 90, 12, 12);
  //TO DO//

  //eara to select penwidth
  fill(0);
  stroke(0);
  ellipse(10, 540, 5, 5);
  ellipse(10, 560, 7.5, 7.5);
  ellipse(10, 580, 10, 10);


  if (mouseIsPressed) {
    var px = pmouseX,
      py = pmouseY,
      x = mouseX,
      y = mouseY;
    if (x < 20) {
      if (y > 530 && y < 550) penwidth = 1;
      else if (y > 550 && y < 570) penwidth = 3;
      else if (y > 570 && y < 590) penwidth = 5;
      else if (y > 20 && y < 40) pen = 1;
      else if (y > 40 && y < 60) pen = 2;
      else if (y > 60 && y < 80) pen = 3;
      else if (y > 80 && y < 100) pen = 4;
      else if (y > 100 && y < 120) pen = 5;
      else if (y > 120 && y < 140) pen = 6;
      //select color
      else if (y > 200 && y < 220) {
        r = 255;
        g = 0;
        b = 0; //red
      } else if (y > 220 && y < 240) {
        r = 255;
        g = 128;
        b = 0; //orange
      } else if (y > 240 && y < 260) {
        r = 255;
        g = 255;
        b = 0; //yellow
      } else if (y > 260 && y < 280) {
        r = 0;
        g = 255;
        b = 0; //green
      } else if (y > 280 && y < 300) {
        r = 0;
        g = 255;
        b = 255; //blue
      } else if (y > 300 && y < 320) {
        r = 0;
        g = 64;
        b = 128;
      } //indigo
      else if (y > 320 && y < 340) {
        r = 128;
        g = 0;
        b = 128;
      } //purple
      else if (y > 340 && y < 360) {
        r = 0;
        g = 0;
        b = 0;
      } //BLACK
    } else {//paint
      if (pen == 1) {
        strokeWeight(penwidth);
        stroke(r, g, b);
        line(px, py, x, y);
      } else if (pen == 2) {
        strokeWeight(penwidth);
        stroke(r, g, b);
        fill(r, g, b)
        ellipse(x, y, 3 * penwidth, 3 * penwidth);
      } else if (pen == 3) {
        strokeWeight(penwidth);
        stroke(r, g, b);
        fill(r, g, b)
        rect(x, y, 3 * penwidth, 3 * penwidth);
      } else if (pen == 4) {
        noStroke();
        fill(255);
        ellipse(x, y, 3 * penwidth, 3 * penwidth);
      } else if (pen == 5)
        drawRainbow(penwidth, px, py, x, y);
      else if (pen == 6)
        drawRaindrop(penwidth, x, y);
    }
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