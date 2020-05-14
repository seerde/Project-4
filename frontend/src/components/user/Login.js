import React, { useState } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";

const Login = (props) => {
  const [login, setLogin] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState({
    isLoggedIn: false,
    message: "",
    variant: "danger",
  });

  let onChangeInput = ({ target: { name, value } }) => {
    setLogin({ ...login, [name]: value });
  };

  let onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/auth/login", login)
      .then((res) => {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          props.userLogin(res.data.token);
          props.history.push("/");
        }
      })
      .catch((err) => {
        setIsLoggedIn({
          isLoggedIn: true,
          message: "email or password incorrect",
          variant: "danger",
        });
        setTimeout(() => {
          setIsLoggedIn({ isLoggedIn: false, message: "", variant: "danger" });
        }, 4000);
      });
  };

  return (
    <>
      {isLoggedIn.isLoggedIn && (
        <Alert variant={isLoggedIn.variant}>{isLoggedIn.message}</Alert>
      )}
      <div className="inner-profile-container">
        <div className="box">
          <div className="input-group">
            <label htmlFor="emil"></label>
            <input
              type="text"
              name="email"
              className="login-input input-xlarge"
              placeholder="Email Address"
              onChange={(e) => onChangeInput(e)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="password"
              className="login-input"
              placeholder="Password"
              onChange={(e) => onChangeInput(e)}
            />
          </div>
          <div className="form-group text-center">
            <button
              type="button"
              className="btn btn-success btn-lg"
              onClick={(e) => onSubmit(e)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
