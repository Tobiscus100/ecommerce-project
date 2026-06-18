import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions' // Adjust path if your logout action is named differently

function Header() {
  const dispatch = useDispatch()

  // Grab user login information from global Redux state
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar 
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }} 
        variant="dark" 
        expand="lg" 
        collapseOnSelect
        className="py-3 shadow-sm"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="fw-bold fs-4 text-white" style={{ letterSpacing: '-0.5px' }}>
              <i className="fas fa-shopping-bag text-warning me-2"></i>PREMIUM<span className="text-warning">SHOP</span>
            </Navbar.Brand>
          </LinkContainer>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto gap-2 align-items-center">
              
              {/* Shopping Cart Link */}
              <LinkContainer to="/cart">
                <Nav.Link className="fw-semibold px-3 text-white">
                  <i className="fas fa-shopping-cart text-warning me-1"></i> Cart
                </Nav.Link>
              </LinkContainer>

              {/* Dynamic Authentication Controls */}
              {userInfo ? (
                <NavDropdown 
                  title={
                    <span className="fw-semibold text-white">
                      <i className="fas fa-user-circle text-warning me-1"></i> {userInfo.name}
                    </span>
                  } 
                  id="username"
                  className="fw-semibold"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>
                      <i className="fas fa-user-sliders me-2 text-primary"></i> View Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item onClick={logoutHandler} className="text-danger">
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="fw-semibold px-3 text-white">
                    <i className="fas fa-user me-1"></i> Login
                  </Nav.Link>
                </LinkContainer>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header