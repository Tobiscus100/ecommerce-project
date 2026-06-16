import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'

function RegisterScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const redirect = searchParams.get('redirect') ? searchParams.get('redirect') : '/'

    const userRegister = useSelector(state => state.userRegister)
    const { error, loading, userInfo } = userRegister

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            setMessage(null)
            dispatch(register(name, email, password))
        }
    }

    return (
        <FormContainer>
            <h1 className="my-4">Register</h1>
            
            {message && <div className="alert alert-danger">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <h2>Loading...</h2>}

            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-light"
                        required
                    ></Form.Control>
                </Form.Group>

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

                <Form.Group controlId='password' className="mb-3">
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

                <Form.Group controlId='confirmPassword' className="mb-4">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-light"
                        required
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='dark' className="w-100 py-2 fw-bold">
                    Register
                </Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    Have an Account?{' '}
                    <Link to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'} style={{ color: '#000', fontWeight: 'bold' }}>
                        Login Here
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default RegisterScreen