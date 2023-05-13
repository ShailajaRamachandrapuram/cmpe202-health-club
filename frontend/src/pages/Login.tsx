import React, { useEffect, useState } from 'react';
import { FormEvent } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { post } from '../services/Rest';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const Login = () => {

    const { setAuth } = useAuth();

    const [username, setUsername] = useState<String>();
    const [password, setPassword] = useState<String>();
    const [showErrAlert, setShowErrAlert] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post('/user/login', {
            name: username,
            password: password,
        }).then((res) => {
            setShowErrAlert(false);
            sessionStorage.setItem('login', JSON.stringify({
                user: res.name,
                user_id: res.id,
                admin: res.admin.data[0] == 1
            }));
            setAuth(true);
            navigate('/');
        }).catch((err) => {
            err.json().then((res: any) => {
                setShowErrAlert(true);
            });
        });
    };

    return(
        <Container>
            <br/>
            {showErrAlert && <Alert variant='danger' onClose={() => setShowErrAlert(false)} dismissible>
                <Alert.Heading>Login Error!</Alert.Heading>
                <p>There was an error while logging the user. Please try again!</p>
            </Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Enter Username" defaultValue={username as string | undefined} onChange={(event) => setUsername(event.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" defaultValue={password as string | undefined} onChange={(event) => setPassword(event.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default Login;