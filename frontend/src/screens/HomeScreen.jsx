import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Product from '../components/Product'

function HomeScreen() {
  const dispatch = useDispatch()

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  const categories = ['All', 'Electronics', 'Accessories', 'Apparel', 'Home & Kitchen', 'Fitness', 'Office']

  let filteredProducts = products ? [...products] : []

  if (selectedCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory)
  }

  if (sortBy === 'price-low-high') {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortBy === 'price-high-low') {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price))
  } else if (sortBy === 'top-rated') {
    filteredProducts.sort((a, b) => Number(b.rating) - Number(a.rating))
  }

  return (
    <div>
      {/* Premium Luxury Welcome Hero Banner Section */}
      <div 
        className="p-5 my-4 text-white shadow-sm position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          borderRadius: '16px'
        }}
      >
        <div className="position-relative" style={{ zIndex: 2, maxWidth: '650px' }}>
          <span className="badge bg-warning text-dark fw-bold mb-3 px-3 py-2 rounded-pill text-uppercase">
            Exclusive Collection
          </span>
          <h1 className="display-5 fw-extrabold mb-3" style={{ letterSpacing: '-1.5px', lineHeight: '1.1' }}>
            Discover Exceptional Premium Products
          </h1>
          <p className="lead text-white-50 mb-4" style={{ fontSize: '1.05rem', fontWeight: '400' }}>
            Explore our curated catalog of top-tier electronics, sleek luxury accessories, modern apparel, and workspace essentials designed for you.
          </p>
          <Button variant="warning" className="fw-bold px-4 py-2 rounded-pill text-dark border-0 shadow-sm">
            Explore Collections <i className="fas fa-arrow-right ms-2"></i>
          </Button>
        </div>
        <div 
          className="position-absolute opacity-10 rounded-circle bg-white" 
          style={{ width: '400px', height: '400px', right: '-100px', bottom: '-100px' }}
        />
      </div>

      {/* Utility Action Filter and Sort Toolbar Container */}
      <div className="bg-white p-3 rounded-3 shadow-sm my-4 border d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'dark' : 'light'}
              className="btn-sm px-3 rounded-pill"
              onClick={() => setSelectedCategory(cat)}
              style={{ fontWeight: '500' }}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="d-flex align-items-center gap-2" style={{ minWidth: '220px' }}>
          <Form.Label className="mb-0 text-muted small fw-semibold text-nowrap">Sort By:</Form.Label>
          <Form.Control
            as="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select form-select-sm border-2 rounded"
          >
            <option value="default">Default Catalog</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="top-rated">Top Customer Rated</option>
          </Form.Control>
        </div>
      </div>

      <h2 className="my-3 fw-bold text-dark" style={{ letterSpacing: '-0.5px' }}>
        {selectedCategory === 'All' ? 'Latest Products' : `${selectedCategory} Collection`} 
        <span className="text-muted small fw-normal ms-2">({filteredProducts.length} items available)</span>
      </h2>
      
      {loading ? (
        <h4 className="text-muted">Loading Marketplace Catalog...</h4>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <Row>
          {filteredProducts.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="d-flex align-items-stretch">
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default HomeScreen