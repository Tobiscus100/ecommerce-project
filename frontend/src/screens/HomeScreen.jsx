import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'

function HomeScreen() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await axios.get('http://127.0.0.1:8000/api/products/')
      setProducts(data)
    }
    fetchProducts()
  }, [])

  return (
    <div>
      <h1>Latest Products</h1>
      <Row>
        {products.map(product => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <div className="my-3 p-3 rounded border">
                {/* We will replace this div with a Product Component next */}
                <h3>{product.name}</h3>
                <p>${product.price}</p>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default HomeScreen