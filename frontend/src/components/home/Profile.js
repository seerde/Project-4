import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

const Profile = (props) => {
  let imagePath = "./";

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
            <label className="text-light mx-auto mt-3">
              {props.user ? props.user.username : null}
            </label>
          </Row>
          <Row>
            <label className="text-light text-center mx-auto text-uppercase mt-5">
              Score
            </label>
          </Row>
          <Row>
            <span className="text-light mx-auto text-center mt-3 border pr-5 pl-5 pt-3 pb-3">
              {props.user ? props.user.score : "0"}
            </span>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Profile;
