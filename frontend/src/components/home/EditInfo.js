import React, { Component } from "react";
import { Carousel, Image } from "react-bootstrap";
import axios from "axios";

import ava1 from "../../images/ava1.jpg";
import ava2 from "../../images/ava2.jpg";

export default class EditInfo extends Component {
  state = {
    info: {},
    currentAva: 0,
    ava: ["ava1.jpg", "ava2.jpg"],
  };

  onChangeInput = ({ target: { name, value } }) => {
    this.setState({ info: { ...this.state.info, [name]: value } });
  };
  onImageChange = (eventKey, event) => {
    this.setState({ currentAva: eventKey });
  };

  onSubmit = (e) => {
    console.log(this.state.ava[this.state.currentAva]);
    e.preventDefault();
    axios
      .post(
        "/api/auth/change",
        {
          username: this.state.info.username,
          image: this.state.ava[this.state.currentAva],
        },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      )
      .then(() => {
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div className="inner-profile-container">
        <div className="box">
          <Carousel
            indicators={false}
            interval={null}
            onSelect={this.onImageChange}
            nextIcon={
              <span
                style={{ backgroundColor: "black" }}
                aria-hidden="true"
                className="carousel-control-next-icon"
              />
            }
            prevIcon={
              <span
                style={{ backgroundColor: "black" }}
                aria-hidden="true"
                className="carousel-control-next-icon"
              />
            }
          >
            <Carousel.Item>
              <Image
                className="d-block w-100"
                name="image1"
                src={`${ava1}`}
                alt="First slide"
                roundedCircle
              />
            </Carousel.Item>
            <Carousel.Item>
              <Image
                className="d-block w-100"
                name="image1"
                src={`${ava2}`}
                alt="second slide"
                roundedCircle
              />
            </Carousel.Item>
          </Carousel>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.onChangeInput}
            />
          </div>

          <button type="button" className="btn btn-sm" onClick={this.onSubmit}>
            Edit
          </button>
        </div>
      </div>
    );
  }
}
