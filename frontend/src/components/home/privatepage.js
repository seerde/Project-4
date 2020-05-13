import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export const privatepage = () => {
  return (
    <div>
      <Container>
        <Row xs="2">
          <Col>
            <Container className="home">
              <Row>
                <h1 className="home-h1"> Create private Room </h1>
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
                <h1> PLAYERS </h1>
              </Row>
              <Row>
                <hr></hr>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default privatepage;
