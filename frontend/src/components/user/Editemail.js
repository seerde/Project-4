import React, { Component } from "react";
import axios from "axios";

export default class Editemail extends Component {
  state = {
    info: {},
  };

  onChangeInput = ({ target: { name, value } }) => {
    this.setState({ ...this.state.info, [name]: value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3005/api/auth/ChangeEmail", {
        email: this.state.info.email,
        password: this.state.info.password,
      })
      .then(() => {
        this.props.logout();
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
              type="password"
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
          <button type="button" className="btn btn-sm" onClick={this.onSubmit}>
            Edit
          </button>
        </div>
      </div>
    );
  }
}
