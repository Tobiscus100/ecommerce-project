import React, { useState, useEffect } from 'react'
import axios from 'axios'

function HomeScreen() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get('http://127.0.0.1:8000/api/products/')
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div>
      <h1>Latest Products</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {products.map(product => (
          <div key={product._id} style={{ margin: '10px', border: '1px solid #ddd', padding: '10px' }}>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeScreen