import React, { useEffect, useState } from 'react';

import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from './AuthProvider';
import { get } from "../services/Rest";

export type Location = {
    id: number,
    city: string,
    state: string,
};

interface NavigationProps {
    setCurrentLocation: (currentLocation: number) => void;
};

const Navigation = (props: NavigationProps) => {

    const {auth, user, setAuth} = useAuth();

    const [currentLocation, setCurrentLocation] = useState<number>(1);
    const [currentLocationName, setCurrentLocationName] = useState<String>('');

    const [locations, setLocations] = useState<Location[]> ([]);

    useEffect(() => {
        get('/locations').then((res) => {
            setLocations(res);
            setCurrentLocationName(res[0].state + ' - ' + res[0].city);
        });
    }, []);

    const onDropDownSelect = (eventKey: any) => {
        console.log(eventKey);
        const current = locations.find(loc => loc.id === parseInt(eventKey));
        console.log(current);
        if (!current) {
            return;
        }
        setCurrentLocation(current.id);
        setCurrentLocationName(current.state + ' - ' + current.city);
        props.setCurrentLocation(current.id);
    }

    const onUserDDSelect = (eventKey: any) => {
        if (eventKey === 'logout' && sessionStorage) {
            sessionStorage.removeItem('login');
            setAuth(false);
        }
    }

    return(
        <Navbar bg="dark" variant="dark">
            <Container>
            <Navbar.Brand>Simply Amazing Gym</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Nav>
                    <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
                </Nav>
            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-center">
                <Nav>
                    <Navbar.Text>
                        <b>Selected Location:</b>
                    </Navbar.Text>
                    <NavDropdown title={currentLocationName} id="nav-dropdown" menuVariant='dark' onSelect={onDropDownSelect}>
                        {locations.map((item) => {
                            return <NavDropdown.Item eventKey={item.id}>{item.state} - {item.city}</NavDropdown.Item>;
                        })}
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
            {!auth && <Navbar.Collapse className="justify-content-end">
                <Nav>
                <LinkContainer to="/login"><Nav.Link href="#features">Login</Nav.Link></LinkContainer>
                </Nav>
            </Navbar.Collapse>}
            {auth && <Navbar.Collapse className="justify-content-end">
                <Nav>
                    <Navbar.Text>
                        <b>Welcome </b>
                    </Navbar.Text>
                    <NavDropdown title={user?.user} id="login-nav-dropdown" menuVariant='dark' onSelect={onUserDDSelect}>
                    <LinkContainer to="/profile"><NavDropdown.Item eventKey={'my-profile'}>My Profile</NavDropdown.Item></LinkContainer>
                    {user && user.admin && <LinkContainer to="/admin"><NavDropdown.Item eventKey={'admin'}>Administration</NavDropdown.Item></LinkContainer>}
                        <NavDropdown.Item eventKey={'logout'}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>}
            </Container>
        </Navbar>
    );
};

export default Navigation;