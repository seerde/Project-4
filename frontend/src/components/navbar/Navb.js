import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navb = (props) => {
  const authNavDetails = props.user ? (
    <>
      <Nav.Link as={Link} to="/profile" user={props.user}>
        Profile
      </Nav.Link>
      <Nav.Link as={Link} to="/logout" onClick={props.logout}>
        Logout
      </Nav.Link>
    </>
  ) : (
    <></>
  );

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/" className="Logo">
          Kharbsha
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="justify-content-end"
        >
          <Nav>{authNavDetails}</Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Navb;
