import React, { Component } from "react";
import { Card } from "react-bootstrap";
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
import Background from "./pen.png";
import Eraser from "./eraser.png";

export default class Game extends Component {
  myRef = React.createRef();
  state = {
    currentPlayers: {},
  };

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
          this.wordText.innerHTML = `<span>${this.word}</span>`;
        } else {
          if (timer >= 60) {
            this.wordText.innerHTML = `<span>${this.formatedWord.join(
              " "
            )}</span>`;
          }

          // if (timer == 60 && !isFormating) {
          //   isFormating = true;
          //   this.pickRand();
          //   this.wordText.innerHTML = this.formatedWord.join(" ");
          // }

          if (timer == 40 && !isFormating) {
            isFormating = true;
            this.pickRand();
            this.wordText.innerHTML = `<span>${this.formatedWord.join(
              " "
            )}</span>`;
          }

          if (timer == 20 && !isFormating) {
            isFormating = true;
            this.pickRand();
            this.wordText.innerHTML = `<span>${this.formatedWord.join(
              " "
            )}</span>`;
          }

          if (timer == 5 && !isFormating) {
            isFormating = true;
            this.amount -= 1;
            this.pickRand();
            this.wordText.innerHTML = `<span>${this.formatedWord.join(
              " "
            )}</span>`;
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

      // host = values.host;
      // sessionID = values.sessionid;
      // player = values.player;
      // console.log(`Host: ${host}, Session ID: ${sessionID}, Player: ${player}`);

      host = this.props.match.params.host;
      sessionID = this.props.match.params.sessionid;
      player = this.props.match.params.player;
      lang = this.props.match.params.lang;
      console.log(`Host: ${host}, Session ID: ${sessionID}, Player: ${player}`);

      // Add player to session array
      players.push(player);

      // Creating realtime databases
      playersDB = getPlayerRef(host, sessionID);
      drawingDB = getDrawingRef(host, sessionID);
      timerDB = getTimerRef(host, sessionID);
      chatDB = getChatRef(host, sessionID);
      wordDB = getWordRef(host, sessionID);
      gameDB = getGameRef(host, sessionID);

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
      playersDB.on("value", async (data) => {
        data = data.val();
        if (data) {
          this.setState({
            currentPlayers: data,
          });
          if (data.hasOwnProperty(`${player}`)) {
            isDrawing = data[`${player}`].isDrawing ? true : false;
            if (data[`${player}`].hasOwnProperty(`newScore`)) {
              if (data[`${player}`].newScore > 0) {
                try {
                  await axios.post(
                    "/api/game/addScore",
                    { score: data[`${player}`].newScore },
                    {
                      headers: {
                        "x-auth-token": localStorage.getItem("token"),
                      },
                    }
                  );
                  data[`${player}`].newScore = 0;
                  await playersDB.update(data);
                } catch (error) {
                  console.log(error);
                }
              }
            }
          }
        }
      });

      //
      // CHAT
      /////////////////////////////////
      let chatDiv = p.select(".chat");
      let chatInp = p.select("#inputBox");
      let chatBtn = $("#btnSend");

      chatBtn.on("click", sendToChat);
      $("#inputBox").on("keypress", (e) => {
        if (e.which === 13) {
          sendToChat();
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

        $(".panel-body").scrollTop(100000000);

        if (answer && isDrawing) {
          playersDB.once("value", (data) => {
            data = data.val();

            data[`${playerName}`].score += 5;
            data[`${playerName}`][`newScore`] = 5;
            data[`${player}`].score += 10;
            data[`${player}`][`newScore`] = 5;

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
      let canvas = p.createCanvas(width, height);
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
          answered = false;
          document.querySelector(".timer").innerHTML = `<span>${timer}</span>`;
          gameTimerController(false);
          p.clear();
          p.noLoop();
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
      p.noLoop();
      setTimeout(startRound, 5000);
      function sendToChat() {
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
      }
    };
    p.draw = () => {
      p.stroke(r, g, b);
      p.strokeWeight(penwidth);
      p.fill(0);

      for (let i = 0; i < points.length; i++) {
        let point = points[i];
        p.stroke(point.r, point.g, point.b);
        p.strokeWeight(point.penwidth);
        p.line(point.x, point.y, point.px, point.py);
      }
    };
    p.windowResized = () => {
      let canvasDiv = document.getElementById("canvasContainer");
      let width = canvasDiv.offsetWidth;
      let height = canvasDiv.offsetHeight;
      p.resizeCanvas(width, height);
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
        width: "100%",
        height: "100%",
        top: "0",
        left: "0",
        color: "red",
      });

      words.forEach((e) => {
        wordsBtn.append(`<div class='word__btn'>${e}</div>`);
      });

      $(".word__btn").css({
        fontSize: "24px",
        color: "white",
        alignSelf: "center",
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
  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  render() {
    let playersCard = Object.keys(this.state.currentPlayers).map(
      (player, i) => {
        return (
          <div key={i}>
            <div>{this.state.currentPlayers[player].name}</div>
            <div>{this.state.currentPlayers[player].score}</div>
          </div>
        );
      }
    );
    return (
      <div className="container__cust">
        <div className="row">
          <div className="col-9">
            <div className="game__container">
              <div className="row inner__game__container">
                <div className="col-2 leaderboard__container">
                  <div>{playersCard}</div>
                </div>
                <div className="col-9 drawing__container">
                  <div className="timer">
                    <span>60</span>
                  </div>
                  <div id="canvasContainer" className="canvasContainer"></div>
                  <div className="word">
                    <span>WORD</span>
                  </div>
                </div>
                <div className="col-1 tools__container">
                  <div className="row tools1">
                    <div className="pen__box__row">
                      <div
                        id="eraser"
                        className="pen__box"
                        style={{
                          marginTop: "10px",
                          backgroundImage: `url(${Eraser})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "110% 85%",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    </div>
                    <div className="pen__box__row">
                      <div
                        id="width1"
                        className="pen__box"
                        style={{
                          backgroundColor: "gray",
                          backgroundImage: `url(${Background})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "35% 30%",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div
                        id="width2"
                        className="pen__box"
                        style={{
                          backgroundColor: "gray",
                          backgroundImage: `url(${Background})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "60% 50%",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div
                        id="width3"
                        className="pen__box"
                        style={{
                          backgroundColor: "gray",
                          backgroundImage: `url(${Background})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "85% 65%",
                          backgroundPosition: "center",
                        }}
                      ></div>
                      <div
                        id="width4"
                        className="pen__box"
                        style={{
                          backgroundColor: "gray",
                          backgroundImage: `url(${Background})`,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "110% 85%",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="row tools2">
                    <div className="color__box__row">
                      <div id="aliceblue" className="color__box"></div>
                      <div id="black" className="color__box"></div>
                    </div>
                    <div className="color__box__row">
                      <div id="lightgray" className="color__box"></div>
                      <div id="gray" className="color__box"></div>
                    </div>
                    <div className="color__box__row">
                      <div id="brown" className="color__box"></div>
                      <div id="darkred" className="color__box"></div>
                    </div>
                    <div className="color__box__row">
                      <div id="pink" className="color__box"></div>
                      <div id="red" className="color__box"></div>
                    </div>
                    <div className="color__box__row">
                      <div id="darkorange" className="color__box"></div>
                      <div id="orange" className="color__box"></div>
                    </div>
                    <div className="color__box__row">
                      <div id="khaki" className="color__box"></div>
                      <div id="yellow" className="color__box"></div>
                    </div>
                    <div className="color__box__row">
                      <div id="lightgreen" className="color__box"></div>
                      <div id="green" className="color__box"></div>
                    </div>
                    <div className="color__box__row">
                      <div id="lightskyblue" className="color__box"></div>
                      <div id="lightblue" className="color__box"></div>
                    </div>
                    <div className="color__box__row">
                      <div id="slateblue" className="color__box"></div>
                      <div id="blue" className="color__box"></div>
                    </div>
                    <div className="color__box__row">
                      <div id="violet" className="color__box"></div>
                      <div id="purple" className="color__box"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="chat__container">
              <div id="chat">
                <div className="col">
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
                          <button
                            className="btn btn-warning btn-sm"
                            id="btnSend"
                          >
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
        <button id="draw">start</button>
      </div>
    );
  }
}
