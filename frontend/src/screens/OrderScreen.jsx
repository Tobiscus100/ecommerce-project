import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails } from '../actions/orderActions'

function OrderScreen() {
    const { id } = useParams()
    const dispatch = useDispatch()

    const orderDetails = useSelector((state) => state.orderDetails)
    const { order, loading, error } = orderDetails

    useEffect(() => {
        if (!order || order._id !== Number(id)) {
            dispatch(getOrderDetails(id))
        }
    }, [dispatch, order, id])

    return loading ? (
        <div className="text-center my-5">
            <h2>Loading Order Summary...</h2>
        </div>
    ) : error ? (
        <div className="alert alert-danger my-4">{error}</div>
    ) : (
        <div>
            <h1 className="my-4">Order ID: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush" className="border-bottom pb-3">
                        <ListGroup.Item className="px-0 py-3">
                            <h2>Shipping Details</h2>
                            <p className="mb-2"><strong>Name: </strong> {order.user.name}</p>
                            <p className="mb-2"><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-dark">{order.user.email}</a></p>
                            <p className="mb-3">
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            
                            {order.isDelivered ? (
                                <div className="alert alert-success py-2 mb-0">Delivered on {order.deliveredAt}</div>
                            ) : (
                                <div className="alert alert-warning py-2 mb-0">Not Delivered</div>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item className="px-0 py-3">
                            <h2>Payment Status</h2>
                            <p className="mb-3"><strong>Method: </strong> {order.paymentMethod}</p>
                            
                            {order.isPaid ? (
                                <div className="alert alert-success py-2 mb-0">Paid on {order.paidAt}</div>
                            ) : (
                                <div className="alert alert-danger py-2 mb-0">Awaiting Payment</div>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item className="px-0 py-3">
                            <h2>Items Saved</h2>
                            {order.orderItems.length === 0 ? (
                                <div className="alert alert-info">Order has no items</div>
                            ) : (
                                <ListGroup variant="flush">
                                    {order.orderItems.map((item, index) => (
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
                                <h2>Order Breakdown</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items Total</Col>
                                    <Col className="text-end">${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping Fee</Col>
                                    <Col className="text-end">${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>VAT / Tax</Col>
                                    <Col className="text-end">${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Grand Total</Col>
                                    <Col className="text-end fw-bold">${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            
                            {/* STRIPE ELEMENT ATTACHMENT PORT PLACEHOLDER */}
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    <div className="bg-light p-3 rounded text-center border">
                                        <p className="small text-muted mb-2">Secure Credit Card Processing via Stripe</p>
                                        <button className="btn btn-dark w-100" disabled>Pay with Stripe (Setup Pending)</button>
                                    </div>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen