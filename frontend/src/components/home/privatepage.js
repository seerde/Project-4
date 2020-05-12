import React from 'react'
import { Container, Row, Col, Button } from "react-bootstrap";

export const privatepage = () => {
    return (
        // <div>
        //     <Container fluid  className="home">
        //         <Row>
        //             <h2> About </h2>
        //         </Row>
        //         <Row>
        //             <p> Kharpashah is a multiplayer drawing and guessing game. <br />
        //                 One game consists of a few rounds in which every round someone has to draw their chosen word and others have to guess it to gain points!
        //            </p>
        //         </Row>
        //         <Row>
        //             <h2> Instructions </h2>
        //         </Row>
        //         <Row>
        //             <p> When its your turn to draw, you will have to choose a word from three options and visualize that word in 80 seconds, alternatively when somebody else is drawing you have to type your guess into the chat to gain points, be quick, the earlier you guess a word the more points you get!</p>
        //         </Row>
        //         <>
        //             <Button variant="primary" size="lg" block>
        //                 Start Game
        //             </Button>
        //             <Button variant="secondary" size="lg" block>
        //                 Create private room
        //            </Button>
        //         </>
        //     </Container>
        // </div>

        <div>
        <Container>
<Row xs="2">
       <Col>
      <Container  className="home"> 
          <Row>
              <h1> Create private Rome </h1>
          </Row>
          <Row>
              <input className="name form-control"></input>
          </Row>
          <Row>
              <input className="des form-control"></input>
          </Row>
          <Row>
          <select className="lang form-control form-control-md">
          <option>Large select</option>
      </select>
          </Row>
          <>
              <Button className="btn-primary-start"  block>
                  Start Game
              </Button>
          </>

      </Container>
      </Col>
      <Col>
      <Container className="player"> 

          <Row>
              <h1> PLAYERS</h1>
            
          </Row>
          <Row>
          <hr></hr>
          </Row>
      </Container>
      </Col>
      </Row>
      </Container>
  </div>
    )
}
export default privatepage;
