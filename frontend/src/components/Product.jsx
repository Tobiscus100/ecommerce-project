import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

function Product({ product }) {
  // Safe fallback image if the database ever returns a null or missing asset string
  const defaultImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'

  return (
    <Card className="my-3 p-3 shadow-sm border-0 d-flex flex-column h-100">
      <Link to={`/product/${product._id}`}>
        <Card.Img 
          src={product.image || defaultImage} 
          variant="top" 
          className="rounded" 
          style={{ objectFit: 'cover', height: '220px' }} 
        />
      </Link>

      <Card.Body className="d-flex flex-column justify-content-between px-1 pt-3 pb-0">
        <div>
          <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: '#111' }}>
            <Card.Title as="div" className="mb-2" style={{ fontSize: '0.95rem', lineHeight: '1.4', height: '42px', overflow: 'hidden' }}>
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>

          <Card.Text as="div" className="my-2">
            <Rating 
              value={Number(product.rating) || 0} 
              text={`${product.numReviews || 0} reviews`} 
            />
          </Card.Text>
        </div>

        <Card.Text as="h4" className="mt-2 text-dark fw-bold" style={{ fontSize: '1.15rem' }}>
          ${Number(product.price).toFixed(2)}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product