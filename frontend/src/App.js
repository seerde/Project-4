import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Navb} from "./components/navbar/Navb";
import {Home} from "./components/home/Home";


export default class App extends Component {
  render() {
    return (
      <div>
        <Navb />
        <Home />
      </div>
    )
  }
}
