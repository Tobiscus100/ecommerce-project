import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'

function PlaceOrderScreen() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector((state) => state.cart)
    const { cartItems, shippingAddress, paymentMethod } = cart

    const orderCreate = useSelector((state) => state.orderCreate)
    const { order, success, error } = orderCreate

    // Calculate Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    // Flat shipping fee example ($10 if order under $100, else free)
    const shippingPrice = itemsPrice > 100 ? 0 : 10
    // Estimated tax rate at 15%
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2))
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)

    // Safety Guard: Redirect back to payment if method is missing
    if (!paymentMethod) {
        navigate('/payment')
    }

    useEffect(() => {
        if (success) {
            // Once order is successfully written to Django, redirect to the specific order screen
            navigate(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
        }
    }, [success, navigate, order, dispatch])

    const placeOrderHandler = () => {
        dispatch(
            createOrder({
                orderItems: cartItems,
                shippingAddress: shippingAddress,
                paymentMethod: paymentMethod,
                itemsPrice: itemsPrice.toFixed(2),
                shippingPrice: shippingPrice.toFixed(2),
                taxPrice: taxPrice.toFixed(2),
                totalPrice: totalPrice,
            })
        )
    }

    return (
        <div>
            <h1 className="my-4">Review Your Order</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush" className="border-bottom pb-3">
                        <ListGroup.Item className="px-0 py-3">
                            <h2>Shipping</h2>
                            <p className="mb-0">
                                <strong>Address: </strong>
                                {shippingAddress.address}, {shippingAddress.city}{' '}
                                {shippingAddress.postalCode}, {shippingAddress.country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item className="px-0 py-3">
                            <h2>Payment Method</h2>
                            <p className="mb-0">
                                <strong>Method: </strong>
                                {paymentMethod}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item className="px-0 py-3">
                            <h2>Order Items</h2>
                            {cartItems.length === 0 ? (
                                <div className="alert alert-info">Your cart is empty</div>
                            ) : (
                                <ListGroup variant="flush">
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index} className="px-0 py-2">
                                            <Row className="align-items-center">
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: '#333' }}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4} className="text-end">
                                                    {item.qty} x ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
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
                    <Card className="border-0 shadow-sm mt-4">
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col className="text-end">${itemsPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col className="text-end">${shippingPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col className="text-end">${taxPrice.toFixed(2)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col className="text-end fw-bold">${totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {error && (
                                <ListGroup.Item>
                                    <div className="alert alert-danger mb-0">{error}</div>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block w-100 btn-dark"
                                    disabled={cartItems.length === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen