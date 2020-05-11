import React, { Component } from "react";
import Signup from "./components/user/Signup.js";
import Login from "./components/user/Login.js";
import User from "./components/user/User.js";
import { Home } from "./components/home/Home.js";
import { Switch, Route, Redirect } from "react-router-dom";
import Navb from "./components/navbar/Navb";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = {
    isAuth: false,
    user: null, // temp change it to null
    message: null,
    isLogin: false,
    waiting: false,
  };

  logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");

    this.setState({
      isAuth: false,
      user: null,
      message: null,
    });
  };

  render() {
    return (
      <div className="app">
        <Navb />
        <Switch>
          <Route exact path="/" component={Home} />} />
          <Route exact path="/user" component={User} />} />
          <Route path="/signup" component={Signup} />} />
          <Route
            path="/login"
            render={(props) => (
              <Login
                {...props}
                authLogin={this.authLogin}
                userLogin={this.userLogin}
              />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
