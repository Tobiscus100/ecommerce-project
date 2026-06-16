import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

// This component centers any child form passed into it
function FormContainer({ children }) {
  return (
    <Container>
        <Row className='justify-content-md-center'>
            <Col xs={12} md={6}>
                {children}
            </Col>
        </Row>
    </Container>
  )
}

export default FormContainer