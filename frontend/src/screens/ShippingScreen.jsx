import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap'

function ShippingScreen() {
  const navigate = useNavigate()

  let currentUser = null
  try {
    currentUser = JSON.parse(localStorage.getItem('userInfo'))
  } catch {
    currentUser = null
  }

  const userId = currentUser ? (currentUser.id || currentUser._id || currentUser.email) : 'guest'
  const userShippingKey = `shippingAddress_${userId}`
  const userDefaultKey = `defaultShippingAddress_${userId}`

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [useDefault, setUseDefault] = useState(false)
  const [saveAsDefault, setSaveAsDefault] = useState(false)
  const [defaultSavedAddress, setDefaultSavedAddress] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=/shipping')
      return
    }

    try {
      const savedDefault = JSON.parse(localStorage.getItem(userDefaultKey))
      const currentOrder = JSON.parse(localStorage.getItem(userShippingKey)) || JSON.parse(localStorage.getItem('shippingAddress'))

      if (savedDefault && Object.keys(savedDefault).length > 0 && savedDefault.address) {
        setDefaultSavedAddress(savedDefault)
        setUseDefault(true)
        setAddress(savedDefault.address || '')
        setCity(savedDefault.city || '')
        setPostalCode(savedDefault.postalCode || '')
        setCountry(savedDefault.country || '')
      } else if (currentOrder && Object.keys(currentOrder).length > 0) {
        setAddress(currentOrder.address || '')
        setCity(currentOrder.city || '')
        setPostalCode(currentOrder.postalCode || '')
        setCountry(currentOrder.country || '')
      }
    } catch {
      // Fallback cleanly on unreadable cached state
    }
  }, [navigate, userDefaultKey, userShippingKey])

  const handleToggleDefault = (e) => {
    const checked = e.target.checked
    setUseDefault(checked)

    if (checked && defaultSavedAddress) {
      setAddress(defaultSavedAddress.address || '')
      setCity(defaultSavedAddress.city || '')
      setPostalCode(defaultSavedAddress.postalCode || '')
      setCountry(defaultSavedAddress.country || '')
    } else {
      setAddress('')
      setCity('')
      setPostalCode('')
      setCountry('')
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()

    const shippingData = {
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
    }

    localStorage.setItem('shippingAddress', JSON.stringify(shippingData))
    localStorage.setItem(userShippingKey, JSON.stringify(shippingData))

    if (saveAsDefault || useDefault) {
      localStorage.setItem(userDefaultKey, JSON.stringify(shippingData))
    }

    navigate('/placeorder')
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-5 text-center g-2 small fw-bold text-uppercase tracking-wider">
        <Col xs={4} className="text-secondary border-bottom pb-2">1. Sign In</Col>
        <Col xs={4} className="text-warning border-bottom border-warning border-3 pb-2">2. Shipping</Col>
        <Col xs={4} className="text-secondary border-bottom pb-2">3. Payment</Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={6} sm={12}>
          <Card className="p-4 shadow-sm border-0 rounded-3">
            <Card.Body>
              <h3 className="fw-bold mb-4 text-body">Shipping Logistics</h3>

              {defaultSavedAddress && (
                <div className="mb-4 p-3 border border-warning rounded-3 bg-body-secondary">
                  <Form.Check
                    type="checkbox"
                    id="useDefaultToggle"
                    label="Use my saved default shipping address"
                    checked={useDefault}
                    onChange={handleToggleDefault}
                    className="fw-bold text-warning cursor-pointer"
                  />
                  {useDefault && (
                    <p className="small text-muted mb-0 mt-2 ms-4 font-monospace">
                      {defaultSavedAddress.address}, {defaultSavedAddress.city}, {defaultSavedAddress.country} ({defaultSavedAddress.postalCode})
                    </p>
                  )}
                </div>
              )}

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label className="text-muted small fw-medium">Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="py-2 bg-body-secondary border-0 rounded-2 text-body"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="city">
                  <Form.Label className="text-muted small fw-medium">City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="py-2 bg-body-secondary border-0 rounded-2 text-body"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col sm={6} xs={12} className="mb-3">
                    <Form.Group controlId="postalCode">
                      <Form.Label className="text-muted small fw-medium">Postal Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. 100001"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="py-2 bg-body-secondary border-0 rounded-2 text-body"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col sm={6} xs={12} className="mb-3">
                    <Form.Group controlId="country">
                      <Form.Label className="text-muted small fw-medium">Country</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="py-2 bg-body-secondary border-0 rounded-2 text-body"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {!useDefault && (
                  <Form.Group className="mb-3 mt-2" controlId="saveAsDefault">
                    <Form.Check
                      type="checkbox"
                      label="Save this as my default address for future checkouts"
                      checked={saveAsDefault}
                      onChange={(e) => setSaveAsDefault(e.target.checked)}
                      className="small text-muted"
                    />
                  </Form.Group>
                )}

                <Button
                  type="submit"
                  variant="warning"
                  className="w-100 py-2.5 mt-3 rounded-pill fw-bold text-uppercase tracking-wider shadow-sm text-dark"
                >
                  Continue to Payment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ShippingScreen