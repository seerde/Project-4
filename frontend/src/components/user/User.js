import React, { Component } from "react";
import Login from "../user/Login";
import Signup from "../user/Signup";
export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: true,
      isRegisterOpen: false,
    };
  }
  showLogin() {
    this.setState({ isLoginOpen: true, isRegisterOpen: false });
  }
  showSingup() {
    this.setState({ isRegisterOpen: true, isLoginOpen: false });
  }
  render() {
    return (
      <div>
        <div>tttt</div>
        <div className="inner-container">
          <div className="box"></div>
        </div>
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
