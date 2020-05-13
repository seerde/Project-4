import React, { Component } from 'react'
import { Carousel } from "react-bootstrap"; 

export default class EditInfo extends Component {
    render() {
        return (
            <div className="inner-profile-container">
            <div className="box">
            <Carousel>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="holder.js/200x200?text=First slide&bg=373940"
      alt="First slide"
    />
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="holder.js/200x200?text=Second slide&bg=282c34"
      alt="second slide"
    />
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100"
      src="holder.js/200x200?text=Third slide&bg=20232a"
      alt="Third slide"
    />
  </Carousel.Item>
</Carousel>
              <div className="input-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                //   onChange={changeHandler}
                />
              </div>
      
              <div className="input-group">
                <label htmlFor="emil"></label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address "
                //   onChange={changeHandler}
                />
              </div>
      
              <div className="input-group">
                <label htmlFor="password"></label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                //   onChange={changeHandler}
                />
              </div>
      
              <div className="input-group">
                <label htmlFor="password"></label>
                <input
                  type="password"
                  name="password_confirmation"
                  placeholder="Password confirmation "
                //   onChange={changeHandler}
                />
              </div>
      
              <button
                type="button"
                className="btn btn-sm"
                // onClick={(e) => registerHandler(e)}
              >
                Edit
              </button>
            </div>
          </div>
        )
    }
}
