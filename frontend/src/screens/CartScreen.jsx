import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button, Card, Container, Form } from 'react-bootstrap'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const BACKEND_URL = rawUrl.replace(/\/+$/, '')

function CartScreen() {
  const navigate = useNavigate()
  const { cartItems, addToCart, removeFromCart } = useCart()

  const getItemImage = (imgSrc) => {
    if (!imgSrc) return 'https://via.placeholder.com/200'

    if (imgSrc.includes('://http://') || imgSrc.includes('://https://')) {
      const splitIndex = imgSrc.lastIndexOf('http')
      return imgSrc.substring(splitIndex)
    }

    if (imgSrc.startsWith('/')) {
      return `${BACKEND_URL}${imgSrc}`
    }

    if (imgSrc.includes('127.0.0.1:8000') || imgSrc.includes('onrender.com')) {
      return imgSrc
        .replace(/https?:\/\/127\.0\.0\.1:8000/, BACKEND_URL)
        .replace(/https?:\/\/.*\.onrender\.com/, BACKEND_URL)
    }

    return imgSrc
  }

  const increaseQtyHandler = (item) => {
    const maxStock = Number(item.countInStock) >= 0 ? Number(item.countInStock) : 10
    const currentQty = Number(item.qty) || 0
    if (currentQty >= maxStock) return
    addToCart(item, 1)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const decreaseQtyHandler = (item) => {
    const currentQty = Number(item.qty) || 1
    if (currentQty <= 1) return
    addToCart(item, -1)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleQtyChangeHandler = (item, val) => {
    const maxStock = Number(item.countInStock) >= 0 ? Number(item.countInStock) : 10

    if (val === '') {
      addToCart({ ...item, qty: '' }, 0)
      return
    }

    const parsed = parseInt(val, 10)
    if (isNaN(parsed) || parsed < 1) {
      addToCart({ ...item, qty: 1 }, 0)
    } else if (parsed > maxStock) {
      addToCart({ ...item, qty: maxStock }, 0)
    } else {
      const currentQty = Number(item.qty) || 0
      addToCart(item, parsed - currentQty)
    }
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleQtyBlurHandler = (item) => {
    if (item.qty === '' || isNaN(Number(item.qty))) {
      const currentQty = Number(item.qty) || 0
      addToCart(item, 1 - currentQty)
      window.dispatchEvent(new Event('cartUpdated'))
    }
  }

  const removeItemHandler = (id) => {
    removeFromCart(id)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const checkoutHandler = () => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      navigate('/shipping')
    } else {
      navigate('/login?redirect=/shipping')
    }
  }

  const totalItems = cartItems.reduce((acc, item) => acc + (Number(item.qty) || 0), 0)
  const rawTotalPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0
  )

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold text-body">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="alert alert-secondary rounded-3 p-4">
          Your cart is currently empty.{' '}
          <Link to="/" className="fw-semibold text-decoration-none text-body border-bottom border-secondary-subtle ms-1">
            Go Back to Storefront
          </Link>
        </div>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            <ListGroup variant="flush" className="rounded-3 shadow-sm p-2">
              {cartItems.map((item, index) => {
                const currentID = item._id || item.id || index
                const maxStock = Number(item.countInStock) >= 0 ? Number(item.countInStock) : 10

                return (
                  <ListGroup.Item key={currentID} className="py-4 border-0 border-bottom mx-2">
                    <Row className="align-items-center g-3">
                      <Col xs={3} sm={2}>
                        <Image 
                          src={getItemImage(item.image)} 
                          alt={item.name} 
                          fluid 
                          rounded 
                          className="bg-body-secondary object-fit-cover" 
                        />
                      </Col>

                      <Col xs={9} sm={4}>
                        <Link to={`/product/${currentID}`} className="text-body fw-bold text-decoration-none d-block text-truncate fs-6">
                          {item.name}
                        </Link>
                        <span className="text-success small fw-semibold">
                          {maxStock > 0 ? 'In Stock' : 'Limited Supply'}
                        </span>
                      </Col>

                      <Col xs={4} sm={2} className="fw-bold text-secondary fs-6 font-monospace">
                        ₦{Number(item.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Col>

                      <Col xs={5} sm={3}>
                        <div className="d-inline-flex align-items-center border rounded-pill bg-body-secondary p-1 shadow-sm">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-body text-decoration-none px-2 py-1 d-flex align-items-center justify-content-center"
                            onClick={() => decreaseQtyHandler(item)}
                            disabled={Number(item.qty) <= 1}
                          >
                            <FiMinus size={14} />
                          </Button>

                          <Form.Control
                            type="text"
                            value={item.qty}
                            onChange={(e) => handleQtyChangeHandler(item, e.target.value)}
                            onBlur={() => handleQtyBlurHandler(item)}
                            className="text-center bg-transparent border-0 p-0 fw-bold font-monospace text-body focus-none"
                            style={{ width: '35px', boxShadow: 'none', fontSize: '0.95rem' }}
                          />

                          <Button
                            variant="link"
                            size="sm"
                            className="text-body text-decoration-none px-2 py-1 d-flex align-items-center justify-content-center"
                            onClick={() => increaseQtyHandler(item)}
                            disabled={Number(item.qty) >= maxStock}
                          >
                            <FiPlus size={14} />
                          </Button>
                        </div>
                      </Col>

                      <Col xs={3} sm={1} className="text-end">
                        <Button
                          type="button"
                          variant="outline-danger"
                          size="sm"
                          className="rounded-circle border-0 p-2 d-inline-flex align-items-center justify-content-center"
                          onClick={() => removeItemHandler(currentID)}
                        >
                          <FiTrash2 size={16} />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Col>

          <Col lg={4}>
            <Card className="p-3 shadow-sm border-0 rounded-3 position-sticky" style={{ top: '24px' }}>
              <Card.Body>
                <h4 className="fw-bold mb-3 text-body fs-5">Subtotal ({totalItems}) items</h4>
                <div className="d-flex justify-content-between align-items-center mb-4 pt-2 border-top">
                  <span className="text-muted fw-semibold">Estimated Total:</span>
                  <span className="fs-3 fw-bold text-success font-monospace">
                    ₦{rawTotalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-100 py-3 rounded-pill fw-bold text-uppercase tracking-wider shadow-sm text-white fs-6 d-flex align-items-center justify-content-center gap-2"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  <FiShoppingBag size={18} /> Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default CartScreen