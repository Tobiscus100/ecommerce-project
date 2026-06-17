import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'

function PaymentScreen() {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Safety Guard: If there is no shipping address, redirect back to shipping
    if (!shippingAddress || !shippingAddress.address) {
        navigate('/shipping')
    }

    // ALIGNED: Setting Stripe as the default payment method for this project
    const [paymentMethod, setPaymentMethod] = useState('Stripe')

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder') 
    }

    return (
        <FormContainer>
            <h1 className="my-4">Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-4">
                    <Form.Label as="legend">Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type="radio"
                            label="Stripe (Credit/Debit Card)"
                            id="Stripe"
                            name="paymentMethod"
                            value="Stripe"
                            checked={paymentMethod === 'Stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="my-2"
                        ></Form.Check>
                    </Col>
                </Form.Group>

                <Button type="submit" variant="dark" className="w-100 py-2">
                    Continue to Place Order
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen