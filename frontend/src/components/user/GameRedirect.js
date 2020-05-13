import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { getSessionRef } from "../firebase/firebase";

export default class GameRedirect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      host: "",
      sessionID: "",
      player: "",
      players: [],
      check: false,
    };
  }

  setup = () => {
    this.setState({
      host: this.props.match.params.host,
      sessionID: this.props.match.params.sessionid,
      player: this.props.user.username,
    });
    let { host, sessionID, player } = this.state;
    let sessionDB = getSessionRef(host, sessionID);

    //
    // SESSION
    /////////////////////////////////
    sessionDB.once("value", (data) => {
      data = data.val();
      let tmp = {};
      let playerObj = player;

      if (data) {
        let playerArr = [];
        Object.keys(data).forEach((key, index) => {
          let player = data[key];
          playerArr.push(player);
          tmp[`${player.username}`] = player;
        });
        tmp[`${playerObj.username}`] = playerObj;
        playerArr.push(playerObj);
        this.setState({
          players: playerArr,
        });
        sessionDB.update(tmp);
      } else {
        tmp[`${playerObj.username}`] = playerObj;
        tmp["start"] = false;
        sessionDB.set(tmp);
      }
    });
    sessionDB.on("value", (data) => {
      data = data.val();
      if (data) {
        if (data.start) {
          //   this.setRedirect();
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
    if (this.props.user) {
    }
    // this.setRedirect();
  }
  renderRedirect = () => {
    return (
      <Redirect
        to={`/game/${this.props.match.params.host}/${this.props.match.params.sessionid}/${this.props.user.username}`}
      />
    );
  };
  render() {
    return (
      <>
        {this.props.user ? this.setup() : null}
        {this.state.redirect && this.props.user ? this.renderRedirect() : null}
        <Container>
          <Row xs="2">
            <Col>
              <Container className="home">
                <Row>
                  <h1> Create private Rome </h1>
                </Row>
                <Row>
                  <input className="name form-control"></input>
                </Row>
                <Row>
                  <input className="des form-control"></input>
                </Row>
                <Row>
                  <select className="lang form-control form-control-md">
                    <option>Large select</option>
                  </select>
                </Row>
                <>
                  <Button className="btn-primary-start" block>
                    Start Game
                  </Button>
                </>
              </Container>
            </Col>
            <Col>
              <Container className="player">
                <Row>
                  <h1> PLAYERS</h1>
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
