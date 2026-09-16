import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const BASE_URL = rawUrl.replace(/\/+$/, '')

export default function PlaceOrderScreen() {
  const navigate = useNavigate()
  const { cartItems } = useCart()
  const [shippingAddress, setShippingAddress] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (!userInfo) {
      navigate('/login?redirect=/placeorder')
      return
    }

    try {
      const storedAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {}
      if (!storedAddress.address) {
        navigate('/shipping')
        return
      }
      setShippingAddress(storedAddress)
    } catch {
      navigate('/shipping')
    }
  }, [navigate])

  const totalItems = cartItems.reduce((acc, item) => acc + (Number(item.qty) || 0), 0)
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0
  )

  const placeOrderHandler = async () => {
    setLoading(true)
    setError('')

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const token = userInfo ? (userInfo.access || userInfo.token) : null

      if (!token) {
        setError('Your session has expired. Please log in again.')
        setLoading(false)
        return
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }

      const { data } = await axios.post(
        `${BASE_URL}/api/orders/stripe-checkout/`,
        { 
          cartItems,
          shippingAddress 
        },
        config
      )

      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Failed to retrieve a valid payment gateway URL.')
      }
    } catch (err) {
      const responseData = err.response && err.response.data
      let message = 'An unexpected connection error occurred during checkout setup.'

      if (responseData) {
        if (typeof responseData.detail === 'string') {
          message = responseData.detail
        } else if (typeof responseData.error === 'string') {
          message = responseData.error
        } else if (typeof responseData === 'object') {
          const firstKey = Object.keys(responseData)[0]
          const firstVal = responseData[firstKey]
          message = Array.isArray(firstVal) ? `${firstKey}: ${firstVal[0]}` : String(firstVal)
        }
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-5 text-center g-2 small fw-bold text-uppercase tracking-wider">
        <Col xs={4} className="text-secondary border-bottom pb-2">1. Sign In</Col>
        <Col xs={4} className="text-secondary border-bottom pb-2">2. Shipping</Col>
        <Col xs={4} className="text-warning border-bottom border-warning border-3 pb-2">3. Payment</Col>
      </Row>

      <Row>
        <Col md={8}>
          <ListGroup variant="flush" className="rounded-3 shadow-sm p-3 mb-4">
            <ListGroup.Item className="border-0 pb-3">
              <h4 className="fw-bold text-body">Delivery Address</h4>
              <p className="mb-0 text-muted mt-2">
                <strong>Details: </strong> 
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className="pt-4 border-top">
              <h4 className="fw-bold text-body mb-3">Review Items</h4>
              {cartItems.length === 0 ? (
                <div className="alert alert-secondary">Your cart is empty</div>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item.id || item._id} className="px-0 py-3 border-0">
                      <Row className="align-items-center">
                        <Col md={2} xs={3}>
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fluid 
                            rounded 
                            className="bg-body-secondary object-fit-cover" 
                          />
                        </Col>
                        <Col md={6} xs={9}>
                          <span className="fw-bold text-body">{item.name}</span>
                        </Col>
                        <Col md={4} xs={12} className="text-md-end mt-2 mt-md-0 fw-semibold text-muted font-monospace">
                          {item.qty} x ₦{Number(item.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} = ₦{(Number(item.qty || 0) * Number(item.price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card className="p-3 shadow-sm border-0 rounded-3">
            <Card.Body>
              <h4 className="fw-bold mb-3 text-body">Order Summary</h4>
              <ListGroup variant="flush">
                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Total Items:</span>
                  <span>{totalItems}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4 pt-2 border-top">
                  <span className="fw-bold text-body">Total Price:</span>
                  <span className="fs-4 fw-bold text-success font-monospace">
                    ₦{itemsPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </ListGroup>

              {error && <div className="alert alert-danger small p-2 rounded-2">{error}</div>}

              <Button
                type="button"
                variant="secondary"
                className="w-100 py-2.5 rounded-pill fw-bold text-uppercase tracking-wider shadow-sm mt-2 text-white"
                disabled={cartItems.length === 0 || loading}
                onClick={placeOrderHandler}
              >
                {loading ? 'Opening Portal...' : 'Pay with Stripe'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}