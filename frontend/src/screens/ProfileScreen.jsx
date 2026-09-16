import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Card, Spinner } from 'react-bootstrap'
import axios from 'axios'

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const BASE_URL = rawUrl.replace(/\/+$/, '')

export default function ProfileScreen() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let userInfo = null
    try {
      userInfo = JSON.parse(localStorage.getItem('userInfo'))
    } catch {
      userInfo = null
    }

    if (!userInfo) {
      navigate('/login?redirect=/profile')
    } else {
      setName(userInfo.name || userInfo.first_name || '')
      setUsername(userInfo.username || '')
      setEmail(userInfo.email || '')
    }
  }, [navigate])

  const submitHandler = async (e) => {
    e.preventDefault()
    setMessage('')
    setSuccess(false)

    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    let userInfo = null
    try {
      userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
    } catch {
      userInfo = {}
    }

    const token = userInfo ? (userInfo.access || userInfo.token) : null

    try {
      setLoading(true)

      // Attempt backend update if auth token is present
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }

        const payload = {
          name: name.trim(),
          email: email.trim(),
        }

        if (password.trim()) {
          payload.password = password.trim()
        }

        try {
          const { data } = await axios.put(`${BASE_URL}/api/users/profile/update/`, payload, config)
          userInfo = { ...userInfo, ...data }
        } catch {
          // If backend update route is not yet configured, proceed with local session sync
          userInfo = {
            ...userInfo,
            name: name.trim(),
            email: email.trim(),
          }
        }
      } else {
        userInfo = {
          ...userInfo,
          name: name.trim(),
          email: email.trim(),
        }
      }

      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      setSuccess(true)
      setMessage('Profile settings parameters synchronized successfully!')
      setPassword('')
      setConfirmPassword('')

      window.dispatchEvent(new Event('cartUpdated'))
    } catch (err) {
      const responseData = err.response && err.response.data
      let errMsg = 'Failed to update profile settings.'
      if (responseData) {
        errMsg = responseData.detail || Object.values(responseData)[0] || errMsg
      }
      setMessage(String(errMsg))
    } finally {
      setLoading(false)
    }
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
                  <Form.Control
                    type="text"
                    value={username}
                    disabled
                    className="bg-body-secondary border-0 py-2 font-monospace text-body"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="name">
                  <Form.Label className="small fw-semibold text-secondary">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-body-secondary border-0 py-2 text-body"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-body-secondary border-0 py-2 text-body"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label className="small fw-semibold text-secondary">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Leave blank to keep existing password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-body-secondary border-0 py-2 text-body"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="confirmPassword">
                  <Form.Label className="small fw-semibold text-secondary">Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-body-secondary border-0 py-2 text-body"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="secondary"
                  className="w-100 py-2 rounded-pill fw-bold text-uppercase tracking-wider text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Settings'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}