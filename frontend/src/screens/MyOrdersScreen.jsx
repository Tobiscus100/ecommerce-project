import React, { useState, useEffect } from 'react'
import { Table, Container, Spinner, Alert } from 'react-bootstrap'
import axios from 'axios'

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        const token = userInfo ? userInfo.access : null

        if (!token) {
          setError('Please sign in to view your order logs.')
          setLoading(false)
          return
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const { data } = await axios.get('http://127.0.0.1:8000/api/orders/my-orders/', config)
        setOrders(data)
      } catch (err) {
        setError(err.response && err.response.data.detail ? err.response.data.detail : 'Could not pull transaction profiles.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const renderShippingAddress = (order) => {
    if (typeof order.shippingAddress === 'string' && order.shippingAddress.trim() !== '') {
      return order.shippingAddress
    }

    if (order.shippingAddress && typeof order.shippingAddress === 'object') {
      const { address, city, country, postalCode } = order.shippingAddress
      const parts = [address, city, country].filter(Boolean)
      const formattedStr = parts.join(', ')
      return postalCode ? `${formattedStr} (${postalCode})` : formattedStr
    }

    if (order.shipping_address) {
      return order.shipping_address
    }

    return 'N/A'
  }

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-body mb-4">My Order History</h2>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="secondary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="small rounded-3">{error}</Alert>
      ) : orders.length === 0 ? (
        <Alert variant="secondary" className="small rounded-3">You have not placed any orders yet.</Alert>
      ) : (
        <div className="table-responsive shadow-sm rounded-3 border p-3">
          <Table hover verticalAlign="middle" className="mb-0 small">
            <thead className="text-uppercase tracking-wider">
              <tr>
                <th>Order ID</th>
                <th>Date Logged</th>
                <th>Total Price</th>
                <th>Payment Status</th>
                <th>Delivery Address</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const orderId = order._id || order.id

                return (
                  <tr key={orderId}>
                    <td className="font-monospace fw-bold text-secondary">#{orderId}</td>
                    <td>{order.createdAt}</td>
                    <td className="fw-bold text-success font-monospace">
                      ₦{Number(order.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      {order.isPaid ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill">
                          Paid ({order.paidAt})
                        </span>
                      ) : (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="text-muted text-truncate" style={{ maxWidth: '240px' }}>
                      {renderShippingAddress(order)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  )
}