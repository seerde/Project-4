import React, { Component } from 'react'
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class Navb extends Component {
  render() {
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="#home">logo</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
  
    <Nav>
      
      <Nav.Link eventKey={2} href="#" >
      Logout
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>


      </div>
    )
  }
}
