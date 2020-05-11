import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { decode } from "jsonwebtoken";
import { Switch, Route } from "react-router-dom";
import User from "./components/user/User.js";
import Navb from "./components/navbar/Navb";
import { Home } from "./components/home/Home";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";

class App extends Component {
  state = {
    isAuth: false,
    user: null
  };

  logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");

    this.setState({
      isAuth: false,
      user: null,
    });
  };


  userLogin = async (token) => {
    try {
      let data = await axios.get("http://localhost:3001/api/auth/user", {
        headers: { "x-auth-token": token }
      });

      this.setState({
        isAuth: true,
        user: data.data.user
      });
    } catch (err) {
      this.setState({
        user: null,
        isAuth: false
      });
    }
  };

  componentDidMount() {
    let token = localStorage.getItem("token");
    if (!(token == null)) {
      let user = decode(token);

      if (!user) {
        localStorage.removeItem("token");
      }

      this.userLogin(token);
    }
  }

  render() {
    const { isAuth, user } = this.state;
    return (
      <div>
        <Navb user={user} logout={this.logoutHandler} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/signup"
            render={(props) => (
              <Signup
                {...props}
                userLogin={this.userLogin}
              />
            )}
          />
          <Route exact path="/user" component={User} />} />
          <Route
            path="/login"
            render={(props) => (
              <Login
                {...props}
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
