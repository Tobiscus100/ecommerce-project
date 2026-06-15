import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails } from '../actions/productActions'
import Rating from '../components/Rating'

function ProductScreen() {
    const [qty, setQty] = useState(1) // Track selected quantity
    
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    useEffect(() => {
        dispatch(listProductDetails(id))
    }, [dispatch, id])

    // Handler for the Add to Cart button
    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`)
    }

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            {loading ? (
                <h2>Loading...</h2>
            ) : error ? (
                <h3 style={{ color: 'red' }}>{error}</h3>
            ) : (
                <Row>
                    {/* Column 1: Product Image */}
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid className="rounded shadow-sm" />
                    </Col>

                    {/* Column 2: Product Info */}
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: <strong>${product.price}</strong>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    {/* Column 3: Action Buy Box */}
                    <Col md={3}>
                        <Card className="border-0 shadow-sm">
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col><strong>${product.price}</strong></Col>
                                    </Row>
                                </ListGroup.Item>
                                
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {/* Dynamic Quantity Dropdown Rule */}
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row className='align-items-center'>
                                            <Col>Qty:</Col>
                                            <Col xs='auto' className='my-1'>
                                                <Form.Control 
                                                    as='select' 
                                                    value={qty} 
                                                    onChange={(e) => setQty(Number(e.target.value))}
                                                    className="form-select"
                                                >
                                                    {[...Array(product.countInStock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Button 
                                        onClick={addToCartHandler}
                                        className='btn-block w-100 btn-dark' 
                                        type='button' 
                                        disabled={product.countInStock === 0}
                                    >
                                        Add to Cart
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    )
}

export default ProductScreen