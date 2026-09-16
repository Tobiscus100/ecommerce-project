import React, { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const BACKEND_URL = rawUrl.replace(/\/+$/, '')

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()
  
  const productId = product._id || product.id
  const maxStock = Number(product.countInStock) >= 0 ? Number(product.countInStock) : 5

  const getProductImage = () => {
    if (!product.image) return 'https://via.placeholder.com/200'
    
    // Fix nested protocol urls
    if (product.image.includes('://http://') || product.image.includes('://https://')) {
      const splitIndex = product.image.lastIndexOf('http')
      return product.image.substring(splitIndex)
    }

    // Relative media path from Django
    if (product.image.startsWith('/')) {
      return `${BACKEND_URL}${product.image}`
    }

    // Replace old dev hostnames with active backend url
    if (product.image.includes('127.0.0.1:8000') || product.image.includes('onrender.com')) {
      return product.image
        .replace(/https?:\/\/127\.0\.0\.1:8000/, BACKEND_URL)
        .replace(/https?:\/\/.*\.onrender\.com/, BACKEND_URL)
    }
    
    return product.image
  }

  const addToCartHandler = () => {
    addToCart(product, 1)
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const cardStyle = {
    boxShadow: isHovered ? '0 10px 25px rgba(0, 0, 0, 0.25)' : 'none',
    border: 'none',
    transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease-in-out',
    transform: isHovered ? 'translateY(-10px)' : 'translateY(0)'
  }

  return (
    <Card 
      className="h-100 my-3 p-3 rounded-3"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${productId}`}>
        <div className="overflow-hidden rounded-2" style={{ height: '200px' }}>
          <Card.Img 
            src={getProductImage()}
            variant="top" 
            className="w-100 h-100 object-fit-cover" 
          />
        </div>
      </Link>

      <Card.Body className="d-flex flex-column justify-content-between p-2">
        <div className="mb-3">
          <Link to={`/product/${productId}`} className="text-decoration-none text-body">
            <Card.Title as="div" className="fs-6 fw-bold mb-2 text-truncate-2" style={{ minHeight: '44px' }}>
              {product.name}
            </Card.Title>
          </Link>
          
          <Card.Text as="h5" className="fw-bold text-success mb-2 font-monospace">
            ₦{Number(product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Card.Text>
        </div>

        <Button
          type="button"
          variant="outline-secondary"
          className="w-100 py-2 rounded-pill fw-bold text-uppercase tracking-wider btn-sm mt-auto d-flex align-items-center justify-content-center gap-2"
          disabled={maxStock === 0}
          onClick={addToCartHandler}
        >
          <FiShoppingBag />
          {maxStock > 0 ? 'Add To Cart' : 'Out of Stock'}
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ProductCard