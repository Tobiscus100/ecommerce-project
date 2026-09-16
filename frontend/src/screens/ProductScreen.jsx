import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Container, Alert, Form } from 'react-bootstrap'
import { FiArrowLeft, FiShoppingBag, FiMinus, FiPlus, FiCheckCircle } from 'react-icons/fi'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const BASE_URL = rawUrl.replace(/\/+$/, '')

export default function ProductScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [mainImage, setMainImage] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const timestamp = new Date().getTime()
        const { data } = await axios.get(`${BASE_URL}/api/products/${id}/?cb=${timestamp}`)
        setProduct(data)
        
        if (data && data.image) {
          if (data.image.includes('://http://') || data.image.includes('://https://')) {
            const splitIndex = data.image.lastIndexOf('http')
            setMainImage(data.image.substring(splitIndex))
          } else if (data.image.startsWith('/')) {
            setMainImage(`${BASE_URL}${data.image}`)
          } else if (data.image.includes('127.0.0.1:8000') || data.image.includes('onrender.com')) {
            setMainImage(
              data.image
                .replace(/https?:\/\/127\.0\.0\.1:8000/, BASE_URL)
                .replace(/https?:\/\/.*\.onrender\.com/, BASE_URL)
            )
          } else {
            setMainImage(data.image)
          }
        }
      } catch (err) {
        setError(
          err.response && err.response.data.detail
            ? err.response.data.detail
            : 'Could not fetch product details.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const maxStock = product && Number(product.countInStock) >= 0 ? Number(product.countInStock) : 0

  const increaseQty = () => {
    if (qty < maxStock) setQty(prev => prev + 1)
  }

  const decreaseQty = () => {
    if (qty > 1) setQty(prev => prev - 1)
  }

  const handleQtyChange = (val) => {
    if (val === '') {
      setQty('')
      return
    }

    const parsed = parseInt(val, 10)
    if (isNaN(parsed) || parsed < 1) {
      setQty(1)
    } else if (parsed > maxStock) {
      setQty(maxStock)
    } else {
      setQty(parsed)
    }
  }

  const handleQtyBlur = () => {
    if (qty === '' || isNaN(qty)) {
      setQty(1)
    }
  }

  const addToCartHandler = () => {
    const finalQty = qty === '' || isNaN(qty) ? 1 : Number(qty)
    addToCart(product, finalQty)
    window.dispatchEvent(new Event('cartUpdated'))
    navigate('/cart')
  }

  if (loading) {
    return (
      <Container className="py-5">
        <div className="skeleton-box mb-5" style={{ height: '31px', width: '180px', borderRadius: '50px' }}></div>
        <Row className="g-5">
          <Col lg={6} md={12}>
            <div className="skeleton-box w-100 mb-3" style={{ height: '480px' }}></div>
          </Col>
          <Col lg={6} md={12}>
            <div className="skeleton-box mb-2" style={{ height: '16px', width: '100px' }}></div>
            <div className="skeleton-box mb-3" style={{ height: '45px', width: '80%' }}></div>
            <div className="skeleton-box mb-4" style={{ height: '30px', width: '140px' }}></div>
            <div className="skeleton-box mb-2" style={{ height: '14px', width: '150px' }}></div>
            <div className="skeleton-box mb-2" style={{ height: '16px' }}></div>
            <div className="skeleton-box mb-2" style={{ height: '16px' }}></div>
            <div className="skeleton-box mb-4" style={{ height: '16px', width: '60%' }}></div>
            <div className="skeleton-box w-100" style={{ height: '220px' }}></div>
          </Col>
        </Row>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="border-0 shadow-sm rounded-3">{error}</Alert>
        <Link to="/" className="btn btn-outline-dark rounded-pill">Back to Storefront</Link>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Link to="/" className="btn btn-outline-dark rounded-pill px-4 mb-5 fw-bold text-uppercase tracking-wider btn-sm d-inline-flex align-items-center gap-2 transition-all hover-card">
        <FiArrowLeft /> Back to Storefront
      </Link>

      {product && (
        <Row className="g-5 align-items-start">
          <Col lg={6} md={12}>
            <div className="overflow-hidden rounded-3 shadow-sm bg-light transition-all" style={{ maxHeight: '480px' }}>
              <Image 
                src={mainImage || 'https://via.placeholder.com/400'} 
                alt={product.name} 
                fluid 
                className="w-100 object-fit-cover transform-hover"
                style={{ height: '480px', transition: 'transform 0.5s ease' }}
              />
            </div>
          </Col>

          <Col lg={6} md={12}>
            <ListGroup variant="flush" className="bg-transparent mb-4">
              <ListGroup.Item className="border-0 bg-transparent px-0 pb-2">
                <span className="text-uppercase text-warning tracking-wider small fw-bold fs-7">
                  {typeof product.category === 'object' ? product.category?.name : (product.category || 'Premium Tier')}
                </span>
                <h1 className="fw-bold text-dark tracking-tight mt-1 mb-2" style={{ fontSize: '2.5rem' }}>{product.name}</h1>
              </ListGroup.Item>

              <ListGroup.Item className="border-0 bg-transparent px-0 py-2">
                <h3 className="fw-extrabold text-success font-monospace">
                  ₦{Number(product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </ListGroup.Item>

              <ListGroup.Item className="border-0 bg-transparent px-0 pt-3">
                <h6 className="fw-bold text-muted text-uppercase tracking-wider small mb-2">Product Description</h6>
                <p className="text-secondary leading-relaxed fs-6" style={{ textAlign: 'justify' }}>
                  {product.description || 'No description available for this premium product selection.'}
                </p>
              </ListGroup.Item>
            </ListGroup>

            <Card className="p-4 border-0 rounded-3 bg-white shadow-sm transition-all hover-shadow">
              <Card.Body className="p-1">
                <Row className="mb-3 align-items-center border-bottom pb-3 g-0">
                  <Col className="text-muted small fw-semibold">Unit Value:</Col>
                  <Col className="fw-bold text-dark text-end font-monospace fs-5">
                    ₦{Number(product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Col>
                </Row>

                <Row className="mb-4 align-items-center border-bottom pb-3 g-0">
                  <Col className="text-muted small fw-semibold">Availability Status:</Col>
                  <Col className="text-end">
                    {maxStock > 0 ? (
                      <span className="d-inline-flex align-items-center gap-1.5 badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill small fw-bold">
                        <FiCheckCircle /> Available ({maxStock} Units)
                      </span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1.5 rounded-pill small fw-bold">
                        Out of Stock
                      </span>
                    )}
                  </Col>
                </Row>

                {maxStock > 0 && (
                  <Row className="mb-4 align-items-center g-0">
                    <Col className="text-muted small fw-semibold">Quantity Allocation:</Col>
                    <Col xs="auto">
                      <div className="d-inline-flex align-items-center border rounded-pill bg-light p-1 shadow-xs" style={{ width: '160px' }}>
                        <Button
                          variant="link"
                          className="text-dark text-decoration-none px-2 py-1 flex-grow-1 d-flex justify-content-center"
                          onClick={decreaseQty}
                          disabled={qty <= 1}
                        >
                          <FiMinus />
                        </Button>
                        <Form.Control
                          type="text"
                          value={qty}
                          onChange={(e) => handleQtyChange(e.target.value)}
                          onBlur={handleQtyBlur}
                          className="text-center bg-transparent border-0 p-0 fw-bold font-monospace text-dark focus-none"
                          style={{ width: '45px', boxShadow: 'none', fontSize: '1.05rem' }}
                        />
                        <Button
                          variant="link"
                          className="text-dark text-decoration-none px-2 py-1 flex-grow-1 d-flex justify-content-center"
                          onClick={increaseQty}
                          disabled={qty >= maxStock}
                        >
                          <FiPlus />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                )}

                <Button
                  type="button"
                  variant="dark"
                  className="w-100 py-3 rounded-pill fw-bold text-uppercase tracking-wider shadow-sm mt-2 d-flex align-items-center justify-content-center gap-2 transition-all transform-hover"
                  disabled={maxStock === 0}
                  onClick={addToCartHandler}
                >
                  <FiShoppingBag /> {maxStock > 0 ? 'Add To Cart Bundle' : 'Temporarily Out of Stock'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}