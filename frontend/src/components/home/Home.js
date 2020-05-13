import React from "react";
import { Link } from "react-router-dom";
import Form from "./Form"
import { Container, Row, Col, Button } from "react-bootstrap";

export const Home = () => {
    return (
        <div>
        <Container>
          <Row>
            <Col>
              <Container className="home">
              <div className="home-box">
                <Row>
                   <h2> About </h2>
                </Row>
                <Row>
                <p>
                            {" "}
                            Kharpashah is a multiplayer drawing and guessing game. <br />
                         One game consists of a few rounds in which every round someone has
                            to draw their chosen word and others have to guess it to gain
                             points!
               </p>
                </Row>
                <Row>
                <h2> Instructions </h2>
                </Row>
                <Row>
                <p>
                             {" "}
                             When its your turn to draw, you will have to choose a word from
                             three options and visualize that word in 80 seconds, alternatively
                             when somebody else is drawing you have to type your guess into the
                             chat to gain points, be quick, the earlier you guess a word the more
                             points you get!
               </p>
                </Row>
                </div>
                <>
                     <Button className="btn-primary-start" class="text-center" block>
                         Start Game
               </Button>
                 </>
                 <>
                     <Button variant="secondary" className="btn-primary-start" class="text-center" block >
                         Create private room
           </Button>
                 </>
              </Container>
            </Col>
            <Col>
              <Container>
              <Form />
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
};
