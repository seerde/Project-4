import React, { Component } from "react";
import Profile from "./Profile";
import EditInfo from "./EditInfo";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfileOpen: true,
    };
  }
  showProfile() {
    this.setState({ isProfileOpen: true });
  }
  showEdit() {
    this.setState({ isProfileOpen: false });
  }
  render() {
    return (
      <div>
        <div className="profile__container">
          <div className="user__btn" onClick={() => this.showProfile()}>
            Profile
          </div>
          <div className="user__btn" onClick={() => this.showEdit()}>
            Edit
          </div>
        </div>
        {this.state.isProfileOpen ? (
          <Profile {...this.props} userLogin={this.props.userLogin} />
        ) : (
          <EditInfo {...this.props} userLogin={this.props.userLogin} />
        )}
      </div>
    );
  }
}
export default Form;
