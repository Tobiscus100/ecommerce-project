import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import axios from 'axios'

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect])

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const config = { headers: { 'Content-Type': 'application/json' } }
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/users/login/',
        { username: email, password: password },
        config
      )

      const userPayload = {
        ...data,
        username: data.username || email.split('@')[0]
      }

      localStorage.setItem('userInfo', JSON.stringify(userPayload))
      
      window.dispatchEvent(new Event('cartUpdated'))

      navigate(redirect)
    } catch (err) {
      setError(err.response && err.response.data.detail
        ? err.response.data.detail
        : 'Invalid credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <Card className="p-4 shadow-sm border-0 rounded-3">
            <Card.Body>
              <h2 className="mb-4 fw-bold text-body">Sign In</h2>
              
              {error && <div className="alert alert-danger py-2 fs-7 rounded-2">{error}</div>}

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="text-muted small fw-medium">Email Address / Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-2 bg-body-secondary border-0 rounded-2 text-body"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="text-muted small fw-medium">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-2 bg-body-secondary border-0 rounded-2 text-body"
                    required
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="w-100 py-2 rounded-pill fw-semibold tracking-wide btn-custom"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </Button>
              </Form>

              <Row className="py-3">
                <Col className="fs-7 text-muted">
                  New Customer?{' '}
                  <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="link-secondary fw-semibold text-decoration-none">
                    Register here
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginScreen