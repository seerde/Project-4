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
    console.log("test");
    this.setState({ isLoginOpen: true });
  }
  showSingup() {
    console.log("test");
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
        {this.state.isLoginOpen ? <Login /> : <Signup />}
      </div>
      // <div className="film-list">
      //   <div className="film-list-filters">
      //     <div className="film-list-filter" onClick={this.showLogin.bind(this)}>
      //       Login
      //     </div>
      //     <div
      //       className="film-list-filter"
      //       onClick={this.showSingup.bind(this)}
      //     >
      //       Sign up
      //     </div>
      //   </div>
      // </div>
    );
  }
}
