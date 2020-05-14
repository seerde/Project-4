import React from 'react'
import { Container, Row, Col, Image } from "react-bootstrap";

const Profile = () => {
    return (
        <div className="inner-profile-container">

            <div className="input-group">
                <Container className="mt-5">
                    <Row>
                        <Image className="rounded mx-auto d-block" src="https://via.placeholder.com/150" rounded />
                    </Row>
                    <Row>
                        <label className="text-light mx-auto mt-3">User Name</label>
                    </Row>
                    <Row>
                        <label className="text-light text-center mx-auto text-uppercase mt-5">Your Score</label>
                    </Row>
                    <Row >
                        <span className="text-light mx-auto text-center mt-3 border pr-5 pl-5 pt-3 pb-3"> 0 </span>
                    </Row>
                </Container>
            </div>

        </div>
    )
}

export default Profile;