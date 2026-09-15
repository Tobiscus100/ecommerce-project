import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card } from 'react-bootstrap'
import axios from 'axios'

export default function RegisterScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/'

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect])

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter credentials.')
      return
    }

    setLoading(false)
    try {
      setLoading(true)
      const config = {
        headers: { 'Content-Type': 'application/json' }
      }

      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/users/register/',
        { name, username, email, password },
        config
      )

      localStorage.setItem('userInfo', JSON.stringify(data))
      
      window.dispatchEvent(new Event('cartUpdated'))
      
      navigate(redirect)
    } catch (err) {
      setError(
        err.response && err.response.data.detail
          ? err.response.data.detail
          : 'An unpredicted network mapping connection breakdown occurred.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow-sm border-0 rounded-3 w-100" style={{ maxWidth: '500px' }}>
        <Card.Body>
          <h2 className="fw-bold text-body text-center mb-4">Create Account</h2>

          {error && <div className="alert alert-danger small p-2 rounded-2">{error}</div>}

          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label className="small fw-semibold text-secondary">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-body-secondary border-0 py-2 text-body"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="small fw-semibold text-secondary">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-body-secondary border-0 py-2 text-body"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-body-secondary border-0 py-2 text-body"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="small fw-semibold text-secondary">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-body-secondary border-0 py-2 text-body"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Label className="small fw-semibold text-secondary">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-body-secondary border-0 py-2 text-body"
              />
            </Form.Group>

            <Button
              type="submit"
              variant="secondary"
              className="w-100 py-2.5 rounded-pill fw-bold text-uppercase tracking-wider shadow-sm mb-3"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Form>

          <Row className="pt-2 text-center">
            <Col className="small text-muted">
              Have an account already?{' '}
              <Link to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'} className="link-secondary fw-bold text-decoration-none border-bottom border-secondary-subtle">
                Login
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}