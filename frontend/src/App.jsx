import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Navbar, Container, Nav, NavDropdown, Badge, Button } from 'react-bootstrap'
import { useCart } from './context/CartContext'

import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import CartScreen from './screens/CartScreen'
import ShippingScreen from './screens/ShippingScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import PaymentSuccessScreen from './screens/PaymentSuccessScreen'
import ProfileScreen from './screens/ProfileScreen' 
import MyOrdersScreen from './screens/MyOrdersScreen'
import ProductScreen from './screens/ProductScreen'

function App() {
  const { cartItems } = useCart()
  const [userInfo, setUserInfo] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Derive cart total directly from active context state in memory
  const cartCount = (cartItems || []).reduce((acc, item) => acc + (Number(item.qty) || 0), 0)

  const syncUserSession = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('userInfo')
      setUserInfo(storedUser ? JSON.parse(storedUser) : null)
    } catch {
      setUserInfo(null)
    }
  }, [])

  useEffect(() => {
    syncUserSession()

    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
      setIsDarkMode(true)
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light')
      setIsDarkMode(false)
    }

    const handleSync = () => syncUserSession()
    window.addEventListener('storage', handleSync)
    window.addEventListener('cartUpdated', handleSync)

    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('cartUpdated', handleSync)
    }
  }, [syncUserSession])

  const toggleThemeHandler = () => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'light')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    setUserInfo(null)
    window.dispatchEvent(new Event('cartUpdated'))
    window.location.href = '/login'
  }

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm sticky-top">
          <Container>
            <Navbar.Brand as={Link} to="/" className="fw-bold tracking-tight text-uppercase fs-4 text-warning">
              Premium Shop
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" className="border-0 text-white" />
            
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto fw-semibold align-items-lg-center gap-1">
                
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="rounded-pill px-3 border-0 me-lg-2 small text-capitalize"
                  onClick={toggleThemeHandler}
                >
                  {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                </Button>

                <Nav.Link as={Link} to="/">Storefront</Nav.Link>
                
                <Nav.Link as={Link} to="/cart" className="d-flex align-items-center me-lg-2 position-relative">
                  <span>Cart</span>
                  {cartCount > 0 && (
                    <Badge pill bg="warning" text="dark" className="ms-2 px-2 py-0.5 font-monospace fw-bold small shadow-sm">
                      {cartCount}
                    </Badge>
                  )}
                </Nav.Link>

                {userInfo ? (
                  <NavDropdown 
                    title={`Hi, ${userInfo.username || userInfo.name || userInfo.email || 'User'}`} 
                    id='username' 
                    className="text-warning border border-warning rounded-pill px-3 btn-sm mt-2 mt-lg-0 text-capitalize"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/profile">👤 View Profile</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-orders">📦 My Orders</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandler} className="text-danger fw-bold">Logout</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to="/login" className="text-warning">Sign In</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <main className="flex-grow-1 bg-body-tertiary">
          <Routes>
            <Route path="/" element={<HomeScreen />} index />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/payment-success" element={<PaymentSuccessScreen />} />
            <Route path="/profile" element={<ProfileScreen />} /> 
            <Route path="/my-orders" element={<MyOrdersScreen />} /> 
            <Route path="/product/:id" element={<ProductScreen />} />
          </Routes>
        </main>

        <footer className="bg-dark text-white text-center py-3 mt-auto border-top border-secondary">
          <Container>
            <small className="text-secondary">
              &copy; {new Date().getFullYear()} PREMIUM SHOP. All Rights Reserved. Production V2 Build.
            </small>
          </Container>
        </footer>
      </div>
    </Router>
  )
}

export default App