import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button, Card, Container, Form } from 'react-bootstrap'
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-project-3cq9.onrender.com'

function CartScreen() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cartItems')
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error('Error reading cart local storage payload:', error)
    }
  }, [])

  const setProductsAndCache = (updatedList) => {
    setCartItems(updatedList)
    localStorage.setItem('cartItems', JSON.stringify(updatedList))
  }

  const getItemImage = (imgSrc) => {
    if (!imgSrc) return 'https://via.placeholder.com/200'
    if (imgSrc.includes('8000/https://') || imgSrc.includes('onrender.com/https://')) {
      return imgSrc.split(/(?:8000|onrender\.com)\//)[1]
    }
    if (imgSrc.startsWith('http://127.0.0.1:8000') || imgSrc.startsWith('http://localhost:8000')) {
      return imgSrc.replace(/http:\/\/(?:127\.0\.0\.1|localhost):8000/, BACKEND_URL)
    }
    if (imgSrc.startsWith('/')) {
      return `${BACKEND_URL}${imgSrc}`
    }
    return imgSrc
  }

  const increaseQtyHandler = (productID, currentQty, maxStock) => {
    const limit = maxStock || 10
    const parsedQty = currentQty === '' ? 0 : Number(currentQty)
    if (parsedQty >= limit) return 
    
    const updatedCart = cartItems.map((item) =>
      (item.id === productID || item._id === productID) ? { ...item, qty: parsedQty + 1 } : item
    )
    setProductsAndCache(updatedCart)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const decreaseQtyHandler = (productID, currentQty) => {
    const parsedQty = currentQty === '' ? 2 : Number(currentQty)
    if (parsedQty <= 1) return 
    
    const updatedCart = cartItems.map((item) =>
      (item.id === productID || item._id === productID) ? { ...item, qty: parsedQty - 1 } : item
    )
    setProductsAndCache(updatedCart)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleQtyChangeHandler = (productID, val, maxStock) => {
    const limit = maxStock || 10
    
    if (val === '') {
      const updatedCart = cartItems.map((item) =>
        (item.id === productID || item._id === productID) ? { ...item, qty: '' } : item
      )
      setProductsAndCache(updatedCart)
      return
    }

    const parsed = parseInt(val, 10)
    let finalQty = parsed

    if (isNaN(parsed) || parsed < 1) {
      finalQty = 1
    } else if (parsed > limit) {
      finalQty = limit
    }

    const updatedCart = cartItems.map((item) =>
      (item.id === productID || item._id === productID) ? { ...item, qty: finalQty } : item
    )
    setProductsAndCache(updatedCart)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleQtyBlurHandler = (productID) => {
    const updatedCart = cartItems.map((item) =>
      (item.id === productID || item._id === productID) && item.qty === '' ? { ...item, qty: 1 } : item
    )
    setProductsAndCache(updatedCart)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const removeFromCartHandler = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id && item._id !== id)
    setProductsAndCache(updatedCart)
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

  const totalItems = cartItems.reduce((acc, item) => acc + (item.qty === '' ? 1 : Number(item.qty) || 0), 0)
  const rawTotalPrice = cartItems.reduce((acc, item) => acc + (item.qty === '' ? 1 : Number(item.qty) || 0) * item.price, 0)

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
                const currentID = item.id || item._id || index 
                const maxStock = item.countInStock || 10

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
                          {item.countInStock > 0 ? 'In Stock' : 'Limited Supply'}
                        </span>
                      </Col>

                      <Col xs={4} sm={2} className="fw-bold text-secondary fs-6 font-monospace">
                        ₦{Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Col>

                      <Col xs={5} sm={3}>
                        <div className="d-inline-flex align-items-center border rounded-pill bg-body-secondary p-1 shadow-sm">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-body text-decoration-none px-2 py-1 d-flex align-items-center justify-content-center"
                            onClick={() => decreaseQtyHandler(currentID, item.qty)}
                            disabled={Number(item.qty) <= 1 || item.qty === ''}
                          >
                            <FiMinus size={14} />
                          </Button>

                          <Form.Control
                            type="text"
                            value={item.qty}
                            onChange={(e) => handleQtyChangeHandler(currentID, e.target.value, maxStock)}
                            onBlur={() => handleQtyBlurHandler(currentID)}
                            className="text-center bg-transparent border-0 p-0 fw-bold font-monospace text-body focus-none"
                            style={{ width: '35px', boxShadow: 'none', fontSize: '0.95rem' }}
                          />

                          <Button
                            variant="link"
                            size="sm"
                            className="text-body text-decoration-none px-2 py-1 d-flex align-items-center justify-content-center"
                            onClick={() => increaseQtyHandler(currentID, item.qty, maxStock)}
                            disabled={Number(item.qty) >= maxStock || item.qty === ''}
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
                          onClick={() => removeFromCartHandler(currentID)}
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