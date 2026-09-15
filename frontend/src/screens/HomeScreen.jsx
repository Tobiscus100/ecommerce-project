import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Container } from 'react-bootstrap'
import ProductCard from '../components/ProductCard'
import axios from 'axios'

// Set your live Render URL here (without a trailing slash)
const BASE_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-project-738i.onrender.com'

function HomeScreen() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    async function fetchData() {
      try {
        const timestamp = new Date().getTime()
        const { data: productsData } = await axios.get(`${BASE_URL}/api/products/?cb=${timestamp}`)
        const { data: categoriesData } = await axios.get(`${BASE_URL}/api/categories/?cb=${timestamp}`)
        
        setProducts(productsData || [])
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error fetching catalog data from Django:', error)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category?.name === activeCategory)

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold text-body">Discover Premium Products</h2>
      
      <div className="d-flex flex-wrap gap-2 mb-4 pb-2 border-bottom border-secondary-subtle">
        <Button 
          variant={activeCategory === 'All' ? 'secondary' : 'outline-secondary'}
          className="rounded-pill px-4 btn-sm tracking-wide transition-all"
          onClick={() => setActiveCategory('All')}
        >
          All Items
        </Button>
        
        {categories.map((cat) => (
          <Button
            key={cat.slug || cat.name}
            variant={activeCategory === cat.name ? 'secondary' : 'outline-secondary'}
            className="rounded-pill px-4 btn-sm tracking-wide text-capitalize transition-all"
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <div key={activeCategory} className="fade-in-up">
        {filteredProducts.length === 0 ? (
          <div className="alert alert-secondary text-center py-5 border rounded-3">
            <p className="text-muted mb-0">No premium products found in this category right now.</p>
          </div>
        ) : (
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Container>
  )
}

export default HomeScreen