import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Form from "./Form";
import UserForm from "./UserFrom";
import { Redirect } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

export const Home = (props) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [startGameBtn, setStartGameBtn] = useState();
  const [redirectToGame, setRedirectToGame] = useState();

  function createSession() {
    let randomSessionID = randomString(5, "#Aa");
    setRedirectToGame(
      <Redirect to={`/game/${props.user.username}/${randomSessionID}`} />
    );
  }

  function randomString(length, chars) {
    let mask = "";
    if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (chars.indexOf("#") > -1) mask += "0123456789";
    let result = "";
    for (let i = length; i > 0; --i)
      result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
  }

  useEffect(() => {
    if (props.isAuth) {
      setIsLoggedin(true);
    } else {
      setIsLoggedin(false);
    }
  });

  useEffect(() => {
    if (isLoggedin) {
      setStartGameBtn(
        <div>
          <>
            <Button className="btn-primary-start text-center" block>
              Start Game
            </Button>
          </>
          <>
            <Button
              variant="secondary"
              className="btn-primary-start text-center"
              block
              onClick={() => {
                createSession();
              }}
            >
              Create private room
            </Button>
          </>
        </div>
      );
    } else {
      setStartGameBtn(<></>);
    }
  }, [isLoggedin]);

  return (
    <div>
      {redirectToGame}
      <Container>
        <Row>
          <Col xs={8}>
            <Container className="home">
              <div className="home-box">
                <Row>
                  <h2 className="homeCus"> About </h2>
                </Row>
                <Row>
                  <p className="homeCus">
                    {" "}
                    Kharpashah is a multiplayer drawing and guessing game.{" "}
                    <br />
                    One game consists of a few rounds in which every round
                    someone has to draw their chosen word and others have to
                    guess it to gain points!
                  </p>
                </Row>
                <Row>
                  <h2 className="homeCus"> Instructions </h2>
                </Row>
                <Row>
                  <p className="homeCus">
                    {" "}
                    When its your turn to draw, you will have to choose a word
                    from three options and visualize that word in 80 seconds,
                    alternatively when somebody else is drawing you have to type
                    your guess into the chat to gain points, be quick, the
                    earlier you guess a word the more points you get!
                  </p>
                </Row>
              </div>
              {startGameBtn}
            </Container>
          </Col>
          <Col xs={4}>
            <Container>
              {props.isAuth ? (
                <Form {...props} userLogin={props.userLogin} />
              ) : (
                <UserForm {...props} userLogin={props.userLogin} />
              )}
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
