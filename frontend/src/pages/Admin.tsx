import { Button, Card, Col, Container, Form, InputGroup, ListGroup, Offcanvas, Row } from "react-bootstrap";
import { useAuth } from "../components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { get, post } from "../services/Rest";
import { Activity } from "./Profile";
import { Schedule } from "./Profile";
import { Membership } from "./Homepage";
import { Location } from "../components/Navigation";

const Admin = () => {

    const { auth, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!(auth && user && user.admin)) {
            navigate('/');
        }
    }, [auth]);

    const [classDate, setClassDate] = useState<Date>(new Date());
    const [activities, setActivites] = useState<Activity[]>([]);
    const [showActivities, setShowActivities] = useState<boolean>(false);
    const [newActivity, setNewActivity] = useState<String>();
    
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [showSchedules, setShowSchedules] = useState<boolean>(false);
    const [newSchedule, setNewSchedule] = useState<String>();

    const [durationHours, setDurationHours] = useState<number>(0);
    const [durationMinutes, setDurationMinutes] = useState<number>(0);
    const [scheduleDate, setScheduleDate] = useState<String>();
    const [scheduleTime, setScheduleTime] = useState<String>();

    const [showEnrollUsers, setShowEnrollUsers] = useState<boolean>(false);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [enrollUsersValidated, setEnrollUsersValidated] = useState<boolean>(false);
    const [username, setUsername] = useState<String>();
    const [password, setPassword] = useState<String>();
    const [phone, setPhone] = useState<String>();
    const [email, setEmail] = useState<String>();
    const [userMembership, setUserMembership] = useState<String>();

    useEffect(() => {
        let date = new Date();
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset*60*1000));
                
        get('/schedules?a_date='+date.toISOString().slice(0, 10)).then((res) => {
            setSchedules(res as Schedule[]);
        }).catch((err) => {
            console.log(err);
        });

    }, []);

    const onClassDateChange = (nextValue: any) => {
        setClassDate(nextValue);
        get('/schedules?a_date='+nextValue.toISOString().slice(0, 10)).then((res) => {
            setSchedules(res as Schedule[]);
        });
    };

    const showActivityOverlay = () => {
        setShowActivities(true);
        get('/activities').then((res) => {
            setActivites(res as Activity[]);
        }).catch((err) => {
            console.log(err);
        });
    };

    const addActivity = () => {
        post('/activity/add', {
            name: newActivity,
        }).then(() => {
            get('/activities').then((res) => {
                setActivites(res as Activity[]);
                setNewActivity('');
            })
        }).catch((err) => {
            console.log(err);
        });
    };

    const closeActivityOverlay = () => {
        setShowActivities(false);
    };

    const showScheduleOverlay = () => {
        setShowSchedules(true);
        get('/schedules').then((res) => {
            setSchedules(res as Schedule[]);
        }).catch((err) => {
            console.log(err);
        });
    };

    const addSchedule = () => {
        const durInMins = durationHours * 60 + durationMinutes;
        post('/schedule/add', {
            name: newSchedule,
            s_date: scheduleDate,
            s_time: scheduleTime,
            duration : durInMins
        }).then(() => {
            get('/schedules?a_date='+classDate.toISOString().slice(0, 10)).then((res) => {
                setSchedules(res as Schedule[]);
                setNewSchedule('');
            });
            closeScheduleOverlay();
        }).catch((err) => {
            console.log(err);
        });
    };

    const closeScheduleOverlay = () => {
        setShowSchedules(false);
    };

    const showEnrollUserOverlay = () => {
        setShowEnrollUsers(true);
        get('/memberships').then((res: Membership[]) => {
            get('/locations').then((res) => {
                setLocations(res);
            });
            setMemberships(res);
        }).catch((err) => {
            console.log(err);
        });
    };

    const closeEnrollUserOverlay = () => {
        setShowEnrollUsers(false);
    };

    const onEnrollUsersSubmit = (event: any) => {
        const form = event.currentTarget;
        setEnrollUsersValidated(true);
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            post('/user/create', {
                name: username,
                password: password,
                phone: phone,
                email: email,
                membership: userMembership,
                admin: false,
            }).then(() => {
                closeEnrollUserOverlay();
            }).catch((err) => {
                console.log(err);
            });
        }
        
    };

    const showLocation = (loc_id: number) => {
        const location = locations.find((location) => {
            return location.id === loc_id;
        });
        if (location) {
            return location.state + " - " + location.city;
        }
        return "";
    };


    return(
        <Container>
            <br/>
            <Row>
                <Col xs={8}>
                    <Card className="text-center" bg="light">
                        <Card.Header as="h5">Schedule Class</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col>
                                    <Calendar
                                        onChange={onClassDateChange}
                                        value={classDate}
                                        />
                                    </Col>
                                    <Col>
                                        <Card style={{ minHeight: '100%' }} border="dark">
                                            <Card.Header as="h6">Classes</Card.Header>
                                                <ListGroup className="list-group-flush">
                                                        {schedules.map((schedule) => {
                                                            return(<ListGroup.Item>{schedule.name} - {schedule.s_time}</ListGroup.Item>);
                                                        })}
                                                </ListGroup>
                                             <Card.Footer>
                                              <Button variant="dark" size="sm" onClick={showScheduleOverlay}>Add Schedule</Button>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        <Card.Footer className="text-muted">Click on a date to check your classes scheduled or sign up for them.</Card.Footer>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center" bg="light">
                        <Card.Header as="h5">Actions</Card.Header>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item><Button variant="dark" size="sm" onClick={showActivityOverlay}>View/Add Activities</Button></ListGroup.Item>
                            <ListGroup.Item><Button variant="dark" size="sm" onClick={showEnrollUserOverlay}>Enroll Customer</Button></ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            <Offcanvas show={showActivities} onHide={closeActivityOverlay} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>View/Add Activities</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <Card className="text-center" bg="light" style={{ minHeight: '15rem' }}>
                    <Card.Header as="h6">All Activities</Card.Header>
                    <ListGroup className="list-group-flush">
                        {activities.map((activity) => {
                            return(<ListGroup.Item>{activity.name}</ListGroup.Item>);
                        })}
                    </ListGroup>
                </Card>
                <br/>
                <Card className="text-center" bg="light">
                    <Card.Header as="h6">Add Activity</Card.Header>
                    <Card.Body>
                        <Form>
                            <InputGroup className="mb-3">
                                    <Form.Control type="text" aria-label="activity" name="add_activity" defaultValue={newActivity as string | undefined} onChange={(event) => setNewActivity(event.target.value)} />
                                    <Button variant="primary" type="button" onClick={addActivity}>
                                        Submit
                                    </Button>
                            </InputGroup>
                        </Form>
                    </Card.Body>

                </Card>
                </Offcanvas.Body>
            </Offcanvas>
            <Offcanvas show={showSchedules} onHide={closeScheduleOverlay} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add Class</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <Card className="text-center" bg="light">
                    <Card.Header as="h6">Add Class</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="date">Date</Form.Label>
                                <Form.Control type="date" id="date" onChange={(event) => setScheduleDate(event.target.value)} required />
                                <Form.Control.Feedback type="invalid">Please enter a correct date.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="time">Time</Form.Label>
                                <Form.Control type="time" id="time" onChange={(event) => setScheduleTime(event.target.value)} required />
                                <Form.Control.Feedback type="invalid">Please enter a correct date.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="time">Duration</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control type="number" min="0" max="23" aria-label="hours" onChange={(event) => setDurationHours(parseInt(event.target.value))} required/>
                                    <InputGroup.Text>Hrs</InputGroup.Text>
                                    <Form.Control type="number" min="0" max="59" aria-label="minutes" onChange={(event) => setDurationMinutes(parseInt(event.target.value))} required/>
                                    <InputGroup.Text>Mins</InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">Please enter hours between 0-23 and minutes between 0-59.</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="time">Class</Form.Label>
                                <InputGroup className="mb-3">
                                        <Form.Control type="text" aria-label="schedule" name="add_schedule" defaultValue={newSchedule as string | undefined} onChange={(event) => setNewSchedule(event.target.value)} />
                                </InputGroup>
                            </Form.Group>
                            <Button variant="primary" type="button" onClick={addSchedule}>Submit</Button>
                        </Form>
                    </Card.Body>

                </Card>
                </Offcanvas.Body>
            </Offcanvas>
            <Offcanvas show={showEnrollUsers} onHide={closeEnrollUserOverlay} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Enroll Users</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <Card className="text-center" bg="light">
                    <Card.Header as="h6">Add Activity</Card.Header>
                    <Card.Body>
                        <Form noValidate validated={enrollUsersValidated} onSubmit={onEnrollUsersSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="username">Username</Form.Label>
                                <Form.Control type="text" id="username" onChange={(event) => setUsername(event.target.value)} required />
                                <Form.Control.Feedback type="invalid">Please enter a correct username.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="password">Password</Form.Label>
                                <Form.Control type="password" id="password" onChange={(event) => setPassword(event.target.value)} required />
                                <Form.Control.Feedback type="invalid">Please enter a correct password.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="phone">Phone Number</Form.Label>
                                <Form.Control type="text" id="phone" onChange={(event) => setPhone(event.target.value)} required />
                                <Form.Control.Feedback type="invalid">Please enter a correct phone number.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="email">Email Address</Form.Label>
                                <Form.Control type="text" id="email" onChange={(event) => setEmail(event.target.value)} required />
                                <Form.Control.Feedback type="invalid">Please enter a correct email address.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="membership">Membership</Form.Label>
                                    <Form.Select aria-label="Membership" id="membership" onChange={(event) => setUserMembership(event.target.value)}>
                                        {memberships.map((membership) => {
                                            return(<option value={membership.id}>{showLocation(membership.location)} - {membership.name} : {membership.cost} for {membership.duration}</option>);
                                        })}
                                    </Form.Select>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                </Offcanvas.Body>
            </Offcanvas>
        </Container>
    );
};
export default Admin;