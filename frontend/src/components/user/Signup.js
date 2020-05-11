import React, { Component } from "react";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  submitSignup(e) {}
  render() {
    return (
      <div className="inner-container">
        <div className="box">
          <div className="input-group">
            <input type="text" name="username " placeholder="Username" />
          </div>

          <div className="input-group">
            <label htmlFor="emil"></label>
            <input type="text" name="Email" placeholder="Email Address " />
          </div>

          <div className="input-group">
            <label htmlFor="password"></label>
            <input type="password" name="password" placeholder="Password" />
          </div>

          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="Password confirmation "
              placeholder="Password confirmation "
            />
          </div>

          <button
            type="button"
            className="btn btn-sm"
            onClick={this.submitSignup.bind(this)}
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }
}

export default Signup;
