import React, { Component } from "react";
import Login from "../user/Login";
import Signup from "../user/Signup";

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: true,
    };
  }
  showLogin() {
    this.setState({ isLoginOpen: true });
  }
  showSingup() {
    this.setState({ isLoginOpen: false });
  }
  render() {
    return (
      <div>
        <div className="user__container">
          <div className="user__btn" onClick={() => this.showLogin()}>
            Login
          </div>
          <div className="user__btn" onClick={() => this.showSingup()}>
            Create Account
          </div>
        </div>
        {this.state.isLoginOpen ? (
          <Login {...this.props} userLogin={this.props.userLogin} />
        ) : (
          <Signup {...this.props} userLogin={this.props.userLogin} />
        )}
      </div>
    );
  }
}
