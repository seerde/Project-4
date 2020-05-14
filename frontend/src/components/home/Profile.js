import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

const Profile = (props) => {
  let imagePath = "./";
  function importAll(r) {
    return r.keys().map(r);
  }

  const images = importAll(require.context("./", false, /\.(png|jpe?g|svg)$/));
  console.log(images);
  return (
    <div className="inner-profile-container">
      <div className="input-group">
        <Container className="mt-5">
          <Row>
            <Image
              className="w-100 rounded mx-auto d-block"
              src={
                props.user
                  ? `${imagePath}${props.user.image}`
                  : "placehold.it/100x100"
              }
              roundedCircle
            />
          </Row>
          <Row>
            <label className="text-light mx-auto">
              {props.user ? props.user.username : null}
            </label>
          </Row>
          <Row className="text-light text-center text-uppercase mt-5">
            <Col xs={6}>
              <label>Overall</label>
            </Col>
            <Col xs={6}>
              <label>Feedback</label>
            </Col>
          </Row>
          <Row className="text-light text-center mt-3">
            <Col xs={6}>
              <span class="border border-primary p-2">
                {props.user ? props.user.score : "0"}
              </span>
            </Col>
            <Col xs={6}>
              <span class="border border-primary p-2">
                {props.user ? props.user.feedback : "0"}
              </span>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Profile;
