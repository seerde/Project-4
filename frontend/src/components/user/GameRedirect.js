import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { getSessionRef } from "../firebase/firebase";

export default class GameRedirect extends Component {
  constructor(props) {
    super(props);
    this.check = false;
    this.lang = "en";
    this.state = {
      redirect: false,
      host: this.props.match.params.host,
      sessionID: this.props.match.params.sessionid,
      players: [],
      sessionDB: "",
    };
  }

  setup = () => {
    this.check = true;
    let { host, sessionID } = this.state;
    let player = this.props.user;
    let sessionDB = getSessionRef(host, sessionID);
    if (host == player.username) {
      sessionDB.remove();
    }

    //
    // SESSION
    /////////////////////////////////
    sessionDB.once("value", (data) => {
      data = data.val();
      let tmp = {};
      let playerObj = player;

      if (data) {
        tmp.players = {};
        Object.keys(data.players).forEach((key, index) => {
          let player = data.players[key];
          tmp.players[`${player.username}`] = player;
        });
        tmp.players[`${playerObj.username}`] = playerObj;
        if (host != player.username) {
        }
        sessionDB.update(tmp);
      } else {
        tmp.players = {};
        tmp.players[`${playerObj.username}`] = playerObj;
        tmp["start"] = false;
        sessionDB.set(tmp);
      }
      this.setState({
        sessionDB: getSessionRef(host, sessionID),
      });
    });
    sessionDB.on("value", (data) => {
      data = data.val();
      if (data) {
        if (data.start) {
          this.lang = data.lang;
          let rand = Math.floor(Math.random() * 1000);
          setTimeout(this.setRedirect, rand);
          // this.setRedirect();
        }
        if (data.players) {
          let tmpArry = [];
          Object.keys(data.players).forEach((key) => {
            tmpArry.push(data.players[key]);
          });
          this.setState({
            players: tmpArry,
          });
        }
      }
    });
  };

  setRedirect = () => {
    this.setState({
      redirect: true,
    });
  };

  componentDidMount() {
    // this.setRedirect();
  }

  componentDidUpdate() {
    if (!this.check) {
      this.setup();
    }
  }

  langSelect(e) {
    this.lang = e.target.value;
  }

  startGame() {
    if (this.state.host == this.props.user.username) {
      this.state.sessionDB.once("value", (data) => {
        data = data.val();
        if (data) {
          data.start = true;
          data.lang = this.lang;
          this.state.sessionDB.update(data);
        }
      });
    }
  }

  renderRedirect = () => {
    return (
      <Redirect
        to={`/game/${this.props.match.params.host}/${this.props.match.params.sessionid}/${this.props.user.username}/${this.lang}`}
      />
    );
  };
  render() {
    let playersCards = this.state.players.map((player, key) => {
      return <div key={key}>{player.username}</div>;
    });
    return (
      <>
        {this.state.redirect && this.props.user ? this.renderRedirect() : null}
        <Container>
          <Row xs="2">
            <Col>
              <Container className="home">
                <Row>
                  <h1> Create private Rome </h1>
                </Row>
                <Row>
                  <select
                    className="lang form-control form-control-md"
                    onChange={(e) => {
                      this.langSelect(e);
                    }}
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </Row>
                <>
                  <Button
                    className="btn-primary-start"
                    block
                    onClick={() => this.startGame()}
                  >
                    Start Game
                  </Button>
                </>
              </Container>
            </Col>
            <Col>
              <Container className="player">
                <Row>
                  <h1> PLAYERS</h1>
                  {playersCards}
                </Row>
                <Row>
                  <hr></hr>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
