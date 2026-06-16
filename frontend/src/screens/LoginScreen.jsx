import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

function LoginScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Find if a redirect path exists in the URL parameters (e.g., ?redirect=shipping)
    const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/'

    const userLogin = useSelector(state => state.userLogin)
    const { error, loading, userInfo } = userLogin

    // If the user is already logged in, send them away from the login page
    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1 className="my-4">Sign In</h1>
            
            {/* Display error message if details are incorrect */}
            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Display loading message while waiting for response */}
            {loading && <h2>Loading...</h2>}

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email' className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-light"
                        required
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password' className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-light"
                        required
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='dark' className="w-100 py-2 fw-bold">
                    Sign In
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer?{' '}
                    <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'} style={{ color: '#000', fontWeight: 'bold' }}>
                        Register Here
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen