import React, { useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { addToCart, removeFromCart } from "../actions/cartActions";

function CartScreen() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Extract quantity from URL query string string (e.g., ?qty=2)
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  // Grab the current cart state from Redux
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const checkoutHandler = () => {
    // Navigate user to login, then redirect cleanly to shipping setup address steps step
    navigate("/login?redirect=shipping");
  };

  return (
    <Row className="my-4">
      {/* Left Column: List of Cart Items */}
      <Col md={8}>
        <h1 className="mb-4 fw-bold text-dark" style={{ letterSpacing: "-0.5px" }}>
          Shopping Cart
        </h1>
        {cartItems.length === 0 ? (
          <div className="alert alert-info border-0 shadow-sm rounded">
            Your cart is currently empty. <Link to="/" className="fw-bold">Go Back Shopping</Link>
          </div>
        ) : (
          <ListGroup variant="flush" className="shadow-sm rounded border">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product} className="p-3 bg-white">
                <Row className="align-items-center">
                  {/* Item Image */}
                  <Col md={2} xs={3}>
                    <Image src={item.image} alt={item.name} fluid className="rounded shadow-sm" />
                  </Col>

                  {/* Item Name Link */}
                  <Col md={3} xs={9} className="my-2 my-md-0">
                    <Link to={`/product/${item.product}`} className="text-dark fw-semibold" style={{ textDecoration: "none" }}>
                      {item.name}
                    </Link>
                  </Col>

                  {/* Item Price */}
                  <Col md={2} xs={4} className="text-muted fw-bold">
                    ${Number(item.price).toFixed(2)}
                  </Col>

                  {/* Quantity Dynamic Adjust Selector Selection Selector */}
                  <Col md={3} xs={5}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                      className="form-select form-select-sm border-2"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>

                  {/* Delete Item Icon Button */}
                  <Col md={2} xs={3} className="text-end">
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                      className="text-danger btn-sm border"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      {/* Right Column: Order Subtotal Buy Box */}
      <Col md={4} className="mt-4 mt-md-0">
        <Card className="border-0 shadow-sm p-2 bg-light">
          <ListGroup variant="flush" className="rounded">
            <ListGroup.Item className="bg-light pt-3">
              <h4 className="fw-bold text-dark">
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
              </h4>
              <h3 className="text-success fw-bold mt-2">
                ${cartItems.reduce((acc, item) => acc + item.qty * Number(item.price), 0).toFixed(2)}
              </h3>
            </ListGroup.Item>
            <ListGroup.Item className="bg-light pb-3">
              <Button
                type="button"
                className="btn-block w-100 btn-dark btn-lg font-weight-bold py-2 shadow-sm"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen;