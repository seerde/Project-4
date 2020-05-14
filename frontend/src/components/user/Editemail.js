import React, { Component } from "react";
import axios from "axios";

export default class Editemail extends Component {
  state = {
    info: {},
  };

  onChangeInput = ({ target: { name, value } }) => {
    this.setState({ info: { ...this.state.info, [name]: value } });
  };

  onSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/auth/ChangeEmail",
        {
          email: this.state.info.email,
          password: this.state.info.password,
        },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      )
      .then(() => {
        this.props.logout(e);
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <div className="box">
          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              type="email"
              name="email"
              placeholder="New Email"
              onChange={this.onChangeInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.onChangeInput}
            />
          </div>
          <button
            type="button"
            className="btn btn-sm"
            onClick={(e) => this.onSubmit(e)}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }
}
