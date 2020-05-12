import React, { Component } from "react";
import {
  getPlayerRef,
  getDrawingRef,
  getTimerRef,
  getChatRef,
  getWordRef,
  getGameRef,
} from "../firebase/firebase";
import p5 from "p5";

import axios from "axios";
import $ from "jquery";
import queryString from "query-string";

import "./styles.css";

export default class Game extends Component {
  myRef = React.createRef();

  Sketch = (p) => {
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
    const values = queryString.parse(this.props.location.search);
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
          this.wordText.innerHTML = this.word;
        } else {
          if (timer >= 60) {
            this.wordText.innerHTML = this.formatedWord.join(" ");
          }

          // if (timer == 60 && !isFormating) {
          //   isFormating = true;
          //   this.pickRand();
          //   this.wordText.innerHTML = this.formatedWord.join(" ");
          // }

          if (timer == 40 && !isFormating) {
            isFormating = true;
            this.pickRand();
            this.wordText.innerHTML = this.formatedWord.join(" ");
          }

          if (timer == 20 && !isFormating) {
            isFormating = true;
            this.pickRand();
            this.wordText.innerHTML = this.formatedWord.join(" ");
          }

          if (timer == 5 && !isFormating) {
            isFormating = true;
            this.amount -= 1;
            this.pickRand();
            this.wordText.innerHTML = this.formatedWord.join(" ");
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

    p.setup = () => {
      // http://localhost:3006/game?host=seerde&sessionid=1&player=seerde

      host = values.host;
      sessionID = values.sessionid;
      player = values.player;
      console.log(`Host: ${host}, Session ID: ${sessionID}, Player: ${player}`);

      // Add player to session array
      players.push(player);

      // Creating realtime databases
      playersDB = getPlayerRef(host, sessionID);
      drawingDB = getDrawingRef(host, sessionID);
      timerDB = getTimerRef(host, sessionID);
      gameDB = getChatRef(host, sessionID);
      wordDB = getWordRef(host, sessionID);
      chatDB = getGameRef(host, sessionID);

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
          gameDB.update({
            start: false,
            clear: false,
            loop: false,
            count: count,
          }); // update players count
        } else {
          tmp[`${playerObj.name}`] = playerObj; // add new data tmp
          playersDB.set(tmp); // push data to database
          gameDB.set({ start: false, clear: false, loop: false, count: 1 }); // push players count
        }
      });
      playersDB.on("value", (data) => {
        data = data.val();
        isDrawing = data[`${player}`].isDrawing ? true : false;
      });

      //
      // CHAT
      /////////////////////////////////
      let chatDiv = p.select(".chat");
      let chatInp = p.select("#inputBox");
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

        let li = p.createElement("li");

        let playerNameEle = p.createElement("strong", playerName);
        playerNameEle.class("primary-font");
        playerNameEle.parent(li);

        let msgEle = p.createElement("p", msg);

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
      let canvas = p.createCanvas(400, 400);
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
          p.loop();
        } else {
          console.log("stopped drawing");
          points = [];
          timer = 60;
          document.querySelector(".timer").innerHTML = timer;
          gameTimerController(false);
          p.clear();
          p.noLoop();
        }
      });
      $("#draw").on("click", startRound); // draw button
      $("#clear").on("click", nextRound); // clear button
      $("#black").on("click", () => pickColor(0, 0, 0));
      $("#red").on("click", () => pickColor(255, 0, 0));
      $("#green").on("click", () => pickColor(0, 255, 0));
      $("#blue").on("click", () => pickColor(0, 0, 255));
      $("#eraser").on("click", () => pickColor(255, 255, 255));
      $("#width1").on("click", () => pickPenwidth(5));
      $("#width2").on("click", () => pickPenwidth(15));
      $("#width3").on("click", () => pickPenwidth(30));

      // stop draw() from looping
      p.noLoop();
    };
    p.draw = () => {
      p.stroke(r, g, b);
      p.strokeWeight(penwidth);
      p.noFill();

      for (let i = 0; i < points.length; i++) {
        let point = points[i];
        p.stroke(point.r, point.g, point.b);
        p.strokeWeight(point.penwidth);
        p.line(point.x, point.y, point.px, point.py);
      }
    };

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
          let wordsArry = await axios.get(
            `http://localhost:3001/api/word/${lang}/random/1/1/1`
          );
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
          x: p.mouseX,
          y: p.mouseY,
          px: p.pmouseX,
          py: p.pmouseY,
          r,
          g,
          b,
          penwidth,
        });
        drawingDB.push({
          x: p.mouseX,
          y: p.mouseY,
          px: p.pmouseX,
          py: p.pmouseY,
          r,
          g,
          b,
          penwidth,
        });
      }
    }

    function drawKeyDownAndMoved() {
      if (p.mouseIsPressed && isDrawing) {
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
          document.querySelector(".timer").innerHTML = timer;
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
  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  render() {
    return (
      <div>
        <div className="container text-center">
          <div className="timer">60</div>
          <div id="canvasContainer"></div>
          <div className="word"></div>
          <div className="buttons">
            <button id="draw">Draw</button>
            <button id="clear">Clear</button>
          </div>
          <div className="colors__container">
            <div className="section">
              <div id="black" className="color__box"></div>
              <div id="red" className="color__box"></div>
              <div id="blue" className="color__box"></div>
              <div id="green" className="color__box"></div>
            </div>

            <div className="section">
              <div id="width1" className="width color__box">
                5
              </div>
              <div id="width2" className="width color__box">
                15
              </div>
              <div id="width3" className="width color__box">
                25
              </div>
            </div>

            <div id="eraser" className="section color__box"></div>
          </div>
        </div>
        <div className="container">
          <div id="chat">
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <span className="glyphicon glyphicon-comment"></span> Chat
                  </div>
                  <div className="panel-body">
                    <ul className="chat"></ul>
                  </div>
                  <div className="panel-footer">
                    <div className="input-group">
                      <input
                        id="inputBox"
                        type="text"
                        className="form-control input-sm"
                        placeholder="Enter your guess"
                      />
                      <span className="input-group-btn">
                        <button className="btn btn-warning btn-sm" id="btnSend">
                          Send
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
