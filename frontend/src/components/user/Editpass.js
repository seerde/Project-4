import React, { Component } from "react";
import axios from "axios";

export default class Editpass extends Component {
  state = {
    info: {},
  };

  onChangeInput = ({ target: { name, value } }) => {
    this.setState({ info: { ...this.state.info, [name]: value } });
  };

  onSubmit = (e) => {
    if (this.state.info.password === this.state.info.rePassword) {
      console.log(this.state.info);
      e.preventDefault();
      axios
        .post(
          "/api/auth/ChangePassword",
          {
            oldpassword: this.state.info.oldPassword,
            newpassword: this.state.info.password,
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
    }
  };

  render() {
    return (
      <div>
        <div className="box">
          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              onChange={this.onChangeInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              onChange={this.onChangeInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="rePassword"
              placeholder="Re-enter New Password"
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
