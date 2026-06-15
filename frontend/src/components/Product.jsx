import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded shadow-sm border-0">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" className="rounded" style={{ objectFit: 'cover', height: '200px' }} />
      </Link>

      <Card.Body className="d-flex flex-column justify-content-between">
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: '#333' }}>
          <Card.Title as="div" className="mb-1">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* This is where the magic happens */}
        <Card.Text as="div">
          <Rating 
            value={product.rating} 
            text={`${product.numReviews} reviews`} 
          />
        </Card.Text>

        <Card.Text as="h4" className="mt-2 color-dark fw-bold">
          ${product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product