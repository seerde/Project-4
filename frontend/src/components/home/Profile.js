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
                        <label className="text-light mx-auto">User Name</label>
                    </Row>
                    <Row className="text-light text-center text-uppercase mt-5">
                        <Col xs={6}>
                        <label>Overall</label>
                        </Col>
                        <Col xs={6}>
                        <label>Feedback</label>
                        </Col>
                    </Row>
                    <Row className="text-light text-center mt-3">
                        <Col xs={6}>
                        <span class="border border-primary p-2"> 0 </span>
                        </Col>
                        <Col xs={6}>
                        <span class="border border-primary p-2"> 0 </span>
                        </Col>
                    </Row>
                </Container>
            </div>

        </div>
    )
}

export default Profile;