import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Product from '../components/Product'

function HomeScreen() {
  const dispatch = useDispatch()

  // Functional state controls
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts())
  }, [dispatch])

  // Extract list departments dynamically to render functional navigation pill filters
  const categories = ['All', 'Electronics', 'Accessories', 'Apparel', 'Home & Kitchen', 'Fitness', 'Office']

  // Core processing computation pipeline
  let filteredProducts = products ? [...products] : []

  // 1. Execute Category Filtering
  if (selectedCategory !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory)
  }

  // 2. Execute Sorting Re-arrangement
  if (sortBy === 'price-low-high') {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortBy === 'price-high-low') {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price))
  } else if (sortBy === 'top-rated') {
    filteredProducts.sort((a, b) => Number(b.rating) - Number(a.rating))
  }

  return (
    <div>
      {/* Utility Action Toolbar Container */}
      <div className="bg-white p-3 rounded shadow-sm my-4 border d-flex flex-wrap justify-content-between align-items-center gap-3">
        {/* Left Side: Department Filter Pills */}
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

        {/* Right Side: Sorting Selector Dropdown Dropdown */}
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
        <span className="text-muted small fw-normal ms-2">({filteredProducts.length} items)</span>
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