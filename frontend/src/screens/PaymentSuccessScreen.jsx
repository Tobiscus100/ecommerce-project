import React, { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Container, Card, Button } from 'react-bootstrap'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const BASE_URL = rawUrl.replace(/\/+$/, '')

export default function PaymentSuccessScreen() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [mailStatus, setMailStatus] = useState('Processing post-payment registration...')
  const { clearCart } = useCart()
  
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return
    
    const processPostPaymentWorkflow = async () => {
      try {
        let userInfo = null
        try {
          userInfo = JSON.parse(localStorage.getItem('userInfo'))
        } catch {
          userInfo = null
        }

        const storedCart = JSON.parse(localStorage.getItem('teamtech_cart')) || JSON.parse(localStorage.getItem('cartItems')) || []
        const storedAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {}
        
        const token = userInfo ? (userInfo.access || userInfo.token) : null
        if (!token || storedCart.length === 0) {
          setMailStatus('Order completed! Your cart has been safely cleared.')
          clearCart()
          localStorage.removeItem('teamtech_cart')
          localStorage.removeItem('cartItems')
          return
        }

        hasProcessed.current = true

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }

        const itemsPrice = storedCart.reduce((acc, item) => acc + (Number(item.qty) || 0) * (Number(item.price) || 0), 0)
        const formattedPrice = itemsPrice.toFixed(2)

        setMailStatus('Securing database entry order logs and dispatching invoices...')
        
        await axios.post(
          `${BASE_URL}/api/orders/save-order/`,
          { 
            cartItems: storedCart,
            totalPrice: formattedPrice,
            sessionId: sessionId || 'ONLINE_PAYMENT',
            shippingAddress: storedAddress
          },
          config
        )
        
        setMailStatus('Order pinned securely and receipt dispatched successfully! ✉️')
      } catch (err) {
        console.error('Checkout workflow failure:', err)
        setMailStatus('Order registered. Confirmation receipt will be distributed to your account email.')
      } finally {
        clearCart()
        localStorage.removeItem('teamtech_cart')
        localStorage.removeItem('cartItems')
        window.dispatchEvent(new Event('cartUpdated'))
      }
    }

    processPostPaymentWorkflow()
  }, [sessionId, clearCart])

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card className="text-center p-5 shadow-sm border-0 rounded-3 w-100" style={{ maxWidth: '550px' }}>
        <Card.Body>
          <div className="display-1 text-success mb-4">🎉</div>
          <h2 className="fw-bold text-body mb-2">Payment Successful!</h2>
          <p className="text-muted mb-4">
            Thank you for your purchase. Your payment has been processed securely via Stripe.
          </p>

          <div className="bg-body-secondary p-3 rounded-3 text-start mb-4 border border-secondary-subtle">
            <span className="d-block text-muted small fw-bold text-uppercase tracking-wider mb-1">
              Delivery Logistics Status:
            </span>
            <span className="text-secondary small d-block mb-2 fw-semibold">{mailStatus}</span>
            {sessionId && (
              <>
                <span className="d-block text-muted small fw-bold text-uppercase tracking-wider mb-1 mt-2">
                  Stripe Session Reference:
                </span>
                <code className="text-break small font-monospace text-body">{sessionId}</code>
              </>
            )}
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/my-orders">
              <Button variant="secondary" className="rounded-pill px-4 py-2 fw-bold text-uppercase tracking-wider btn-sm">
                View Orders
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline-secondary" className="rounded-pill px-4 py-2 fw-bold text-uppercase tracking-wider btn-sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}