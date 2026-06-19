import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from 'axios'

function PaymentScreen() {
    const cart = useSelector(state => state.cart)
    const { shippingAddress, cartItems } = cart

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const stripe = useStripe()
    const elements = useElements()

    const [paymentMethod, setPaymentMethod] = useState('Stripe')
    const [isProcessing, setIsProcessing] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // Safety Guard: If there is no shipping address, redirect back to shipping
    useEffect(() => {
        if (!shippingAddress || !shippingAddress.address) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])

    // Calculate cart subtotal pricing details dynamically
    const itemTotal = cartItems.reduce((acc, item) => acc + item.qty * Number(item.price), 0)
    const shippingPrice = itemTotal > 100 ? 0 : 10
    const grandTotal = itemTotal + shippingPrice

    const submitHandler = async (e) => {
        e.preventDefault()
        
        // Save choice to Redux state
        dispatch(savePaymentMethod(paymentMethod))

        if (!stripe || !elements) {
            return // Stripe elements library has not loaded yet
        }

        setIsProcessing(true)
        setErrorMessage('')

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            }

            // 1. Request secure Client Secret from Django backend intent route
            const { data } = await axios.post(
                '/api/payment/create-intent/',
                { cartItems: cartItems },
                config
            )

            const clientSecret = data.clientSecret

            // 2. Confirm the payment directly via Stripe servers
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: userInfo.name,
                        email: userInfo.email,
                    },
                },
            })

            if (paymentResult.error) {
                setErrorMessage(paymentResult.error.message)
                setIsProcessing(false)
            } else {
                if (paymentResult.paymentIntent.status === 'succeeded') {
                    setIsProcessing(false)
                    // 3. Success! Route user to your complete order pipeline endpoint
                    navigate('/placeorder') 
                }
            }
        } catch (err) {
            setErrorMessage(err.response && err.response.data.detail ? err.response.data.detail : err.message)
            setIsProcessing(false)
        }
    }

    return (
        <FormContainer>
            <Card className="p-4 shadow-sm border rounded-4 bg-white my-4">
                <h1 className="mb-3 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>
                    Payment Method
                </h1>
                
                {errorMessage && <div className="alert alert-danger py-2 small">{errorMessage}</div>}

                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-4">
                        <Form.Label as="legend" className="fs-6 fw-semibold text-muted mb-2">Select Method</Form.Label>
                        <Col>
                            <Form.Check
                                type="radio"
                                label="Stripe (Credit or Debit Card)"
                                id="Stripe"
                                name="paymentMethod"
                                value="Stripe"
                                checked={paymentMethod === 'Stripe'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="fw-bold text-dark"
                            />
                        </Col>
                    </Form.Group>

                    {/* Live Credit Card Entry Fields Area */}
                    <Form.Group className="mb-4 bg-light p-3 rounded-3 border">
                        <Form.Label className="fw-semibold text-secondary small mb-2">Secure Card Details</Form.Label>
                        <div className="py-2.5 px-2 bg-white border rounded">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#0f172a',
                                            '::placeholder': { color: '#94a3b8' },
                                        },
                                        invalid: { color: '#dc2626' },
                                    },
                                }}
                            />
                        </div>
                    </Form.Group>

                    {/* Inline Total Overview */}
                    <div className="d-flex justify-content-between align-items-center border-top pt-3 mb-4">
                        <span className="text-muted fw-semibold">Total Amount Due:</span>
                        <span className="fs-4 fw-bold text-success">${grandTotal.toFixed(2)}</span>
                    </div>

                    <Button 
                        type="submit" 
                        variant="dark" 
                        className="w-100 py-2.5 rounded-pill font-weight-bold text-uppercase shadow-sm"
                        disabled={isProcessing || !stripe}
                        style={{ fontWeight: '600', letterSpacing: '0.5px' }}
                    >
                        {isProcessing ? 'Authorizing Transaction...' : `Authorize & Continue`}
                    </Button>
                </Form>
            </Card>
        </FormContainer>
    )
}

export default PaymentScreen