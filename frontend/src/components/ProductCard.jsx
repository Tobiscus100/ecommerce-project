import React, { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-project-3cq9.onrender.com'

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const maxStock = product.countInStock || 5
  const productId = product.id || product._id

  const getProductImage = () => {
    if (!product.image) return 'https://via.placeholder.com/200'
    
    // Handle double URLs (e.g. backend prepended its host to an external CDN/Cloudinary URL)
    if (product.image.includes('8000/https://') || product.image.includes('onrender.com/https://')) {
      return product.image.split(/(?:8000|onrender\.com)\//)[1]
    }

    // Replace hardcoded local dev URLs with production backend
    if (product.image.startsWith('http://127.0.0.1:8000') || product.image.startsWith('http://localhost:8000')) {
      return product.image.replace(/http:\/\/(?:127\.0\.0\.1|localhost):8000/, BACKEND_URL)
    }

    // If image path is relative (e.g., /media/products/img.jpg), prepend backend domain
    if (product.image.startsWith('/')) {
      return `${BACKEND_URL}${product.image}`
    }
    
    return product.image
  }

  const addToCartHandler = () => {
    try {
      const currentCart = JSON.parse(localStorage.getItem('cartItems')) || []
      const itemExists = currentCart.find((item) => (item.id || item._id) === productId)

      if (itemExists) {
        currentCart.forEach((item) => {
          if ((item.id || item._id) === productId) {
            item.qty = Math.min(item.qty + 1, maxStock)
          }
        })
      } else {
        currentCart.push({
          id: productId,
          _id: productId,
          name: product.name,
          image: getProductImage(),
          price: Number(product.price),
          countInStock: maxStock,
          qty: 1
        })
      }

      localStorage.setItem('cartItems', JSON.stringify(currentCart))
      window.dispatchEvent(new Event('cartUpdated'))
      
    } catch (error) {
      console.error('Failed to append item to client storage context:', error)
    }
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
            ₦{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Card.Text>
        </div>

        <Button
          type="button"
          variant="outline-secondary"
          className="w-100 py-2 rounded-pill fw-bold text-uppercase tracking-wider btn-sm mt-auto d-flex align-items-center justify-content-center gap-2"
          disabled={product.countInStock === 0}
          onClick={addToCartHandler}
        >
          <FiShoppingBag />
          {product.countInStock > 0 ? `Add To Cart` : 'Out of Stock'}
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ProductCard