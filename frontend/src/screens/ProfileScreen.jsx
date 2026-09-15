import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'

export default function ProfileScreen() {
  const navigate = useNavigate()
  
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (!userInfo) {
      navigate('/login')
    } else {
      setName(userInfo.name || '')
      setUsername(userInfo.username || '')
      setEmail(userInfo.email || '')
    }
  }, [navigate])

  const submitHandler = (e) => {
    e.preventDefault()
    setMessage('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
    const updatedUser = {
      ...userInfo,
      name,
      email
    }

    localStorage.setItem('userInfo', JSON.stringify(updatedUser))
    setSuccess(true)
    setMessage('Profile settings parameters synchronized successfully!')
    
    window.dispatchEvent(new Event('cartUpdated'))
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="p-4 shadow-sm border-0 rounded-3">
            <Card.Body>
              <h2 className="fw-bold text-body mb-4">Account Profile</h2>
              
              {message && (
                <div className={`alert ${success ? 'alert-success' : 'alert-danger'} small p-2 rounded-2`}>
                  {message}
                </div>
              )}

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label className="small fw-semibold text-secondary">Username (Immutable)</Form.Label>
                  <Form.Control type="text" value={username} disabled className="bg-body-secondary border-0 py-2 font-monospace text-body" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="name">
                  <Form.Label className="small fw-semibold text-secondary">Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-body-secondary border-0 py-2 text-body" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-body-secondary border-0 py-2 text-body" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="small fw-semibold text-secondary">New Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-body-secondary border-0 py-2 text-body" />
                </Form.Group>

                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label className="small fw-semibold text-secondary">Confirm New Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-body-secondary border-0 py-2 text-body" />
                </Form.Group>

                <Button type="submit" variant="secondary" className="w-100 py-2 rounded-pill fw-bold text-uppercase tracking-wider text-white">
                  Update Settings
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}