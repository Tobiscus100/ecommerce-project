import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        {/* We will handle images properly in the next step */}
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="h3">
          ${product.price}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product