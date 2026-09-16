import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Container, Spinner } from 'react-bootstrap'
import ProductCard from '../components/ProductCard'
import axios from 'axios'

const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const BASE_URL = rawUrl.replace(/\/+$/, '')

function HomeScreen() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const timestamp = new Date().getTime()
        
        const [productsRes, categoriesRes] = await Promise.allSettled([
          axios.get(`${BASE_URL}/api/products/?cb=${timestamp}`),
          axios.get(`${BASE_URL}/api/categories/?cb=${timestamp}`)
        ])

        if (productsRes.status === 'fulfilled') {
          setProducts(Array.isArray(productsRes.value.data) ? productsRes.value.data : [])
        } else {
          console.error('Error fetching products:', productsRes.reason)
          setProducts([])
        }

        if (categoriesRes.status === 'fulfilled') {
          setCategories(Array.isArray(categoriesRes.value.data) ? categoriesRes.value.data : [])
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error('Error fetching catalog data from Django:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => {
        if (!p.category) return false
        
        // Handle object format: { name: 'Electronics', slug: 'electronics' }
        if (typeof p.category === 'object') {
          return (
            p.category.name?.toLowerCase() === activeCategory.toLowerCase() ||
            p.category.slug?.toLowerCase() === activeCategory.toLowerCase()
          )
        }
        
        // Handle string format: 'Electronics'
        return String(p.category).trim().toLowerCase() === activeCategory.trim().toLowerCase()
      })

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
        
        {categories.map((cat, idx) => {
          const catName = typeof cat === 'object' ? (cat.name || cat.slug) : cat
          const catKey = typeof cat === 'object' ? (cat.slug || cat.name || idx) : `${cat}_${idx}`
          const isSelected = activeCategory.toLowerCase() === String(catName).toLowerCase()

          return (
            <Button
              key={catKey}
              variant={isSelected ? 'secondary' : 'outline-secondary'}
              className="rounded-pill px-4 btn-sm tracking-wide text-capitalize transition-all"
              onClick={() => setActiveCategory(catName)}
            >
              {catName}
            </Button>
          )
        })}
      </div>

      <div key={activeCategory} className="fade-in-up">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="secondary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="alert alert-secondary text-center py-5 border rounded-3">
            <p className="text-muted mb-0">No premium products found in this category right now.</p>
          </div>
        ) : (
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product._id || product.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
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