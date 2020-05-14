import React, { useState } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";

const Signup = (props) => {
  const [register, setRegister] = useState({});
  const [isSignedUp, setIsSignedUp] = useState({
    isSigned: false,
    message: "",
    variant: "danger",
  });

  let changeHandler = ({ target: { name, value } }) => {
    setRegister({ ...register, [name]: value });
  };

  let registerHandler = async (e) => {
    e.preventDefault();
    // console.log(register["password_confirmation"])
    if (register["password"] == register["password_confirmation"]) {
      try {
        let data = await axios.post("/api/auth/signup", register);
        if (data.data.token) {
          localStorage.setItem("token", data.data.token);
          props.userLogin(data.data.token);
          props.history.push("/");
        } else throw { message: "something" };
      } catch (err) {
        setIsSignedUp({
          isSigned: true,
          message: "The Email or the username already exsits",
          variant: "danger",
        });
        setTimeout(() => {
          setIsSignedUp({ isSigned: false, message: "" });
        }, 4000);
      }
    } else {
      setIsSignedUp({
        isSigned: true,
        message: "Password doesn't match",
        variant: "danger",
      });
      setTimeout(() => {
        setIsSignedUp({ isSigned: false, message: "" });
      }, 4000);
    }
  };

  return (
    <>
      {isSignedUp.isSigned && (
        <Alert variant={isSignedUp.variant}>{isSignedUp.message}</Alert>
      )}
      <div className="inner-profile-container">
        <div className="box">
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={changeHandler}
            />
          </div>

          <div className="input-group">
            <label htmlFor="emil"></label>
            <input
              type="email"
              name="email"
              placeholder="Email Address "
              onChange={changeHandler}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={changeHandler}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Password confirmation "
              onChange={changeHandler}
            />
          </div>

          <button
            type="button"
            className="btn btn-sm"
            onClick={(e) => registerHandler(e)}
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
