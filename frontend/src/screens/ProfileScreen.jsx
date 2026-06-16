import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

function ProfileScreen() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    useEffect(() => {
        // If user is not logged in, boot them to the login screen
        if (!userInfo) {
            navigate('/login')
        } else {
            // Fetch profile details if state is empty or if we just successfully updated
            if (!user || !user.name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile')) // Passes string 'profile' to standardise action call
            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [navigate, userInfo, user, dispatch, success])

    const submitHandler = (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            setMessage(null)
            dispatch(updateUserProfile({
                'id': user._id,
                'name': name,
                'email': email,
                'password': password
            }))
        }
    }

    return (
        <Row className="mt-4">
            <Col md={3}>
                <h2>User Profile</h2>
                
                {message && <div className="alert alert-danger">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">Profile Updated Successfully!</div>}
                {loading && <h2>Loading...</h2>}

                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className="mb-3">
                        <Form.Label>Name</Form.Label>
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
                        <Form.Label>Change Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Enter New Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-light"
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='confirmPassword' className="mb-4">
                        <Form.Label>Confirm Change Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Confirm New Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-light"
                        ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='dark' className="w-100 py-2 fw-bold">
                        Update Details
                    </Button>
                </Form>
            </Col>

            <Col md={9}>
                <h2>My Orders</h2>
                <div className="alert alert-info py-3 mt-3">
                    Order transaction module pipeline will mount here in the next phase.
                </div>
            </Col>
        </Row>
    )
}

export default ProfileScreen