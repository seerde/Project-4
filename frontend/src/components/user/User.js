import React, { Component } from "react";
import Editemail from "./Editemail";
import Editpass from "./Editpass";

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmailOpen: true,
    };
  }
  showEmail() {
    this.setState({ isEmailOpen: true });
  }
  showPassword() {
    this.setState({ isEmailOpen: false });
  }
  render() {
    return (
      <div>
        <div className="user__container">
          <div className="user__btn" onClick={() => this.showEmail()}>
            Change Email
          </div>
          <div className="user__btn" onClick={() => this.showPassword()}>
            Change Password
          </div>
        </div>
        <div className="inner-container">
          {this.state.isEmailOpen ? (
            <Editemail {...this.props} />
          ) : (
            <Editpass {...this.props} />
          )}
        </div>
      </div>
    );
  }
}
