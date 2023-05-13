import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, InputGroup, ListGroup, Offcanvas, Row } from "react-bootstrap";
import Calendar from "react-calendar";
import { get, post } from "../services/Rest";

export type Activity = {
    id: number,
    name: string,
};

export type UserSchedule = {
    user_id: number,
    schedule_id: number,
};

export type Schedule = {
    id: number,
    name: string,
    duration: number,
    s_date: string,
    s_time: string,
};

export type LogActivity = {
    user_id: string,
    activity_id: string,
    duration: number,
    activity_date: string,
};

const Profile = () => {
    const { auth, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth) {
            navigate('/');
        }
    }, [auth]);

    const [activityDate, setActivityDate] = useState<Date>(new Date());
    const [classDate, setClassDate] = useState<Date>(new Date());
    const [showLogHours, setShowLogHours] = useState<boolean>(false);
    const [activities, setActivites] = useState<Activity[]>([]);

    const [logActivity, setLogActivity] = useState<String>("1");
    const [logDate, setLogDate] = useState<String>();
    const [logHours, setLogHours] = useState<number>(0);
    const [logMinutes, setLogMinutes] = useState<number>(0);
    const [logActivityValidated, setLogActivityValidated] = useState<boolean>(false);

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [userSchedules, setUserSchedules] = useState<UserSchedule[]>([]);

    const [userActivitiesForDate, setUserActivitiesForDate] = useState<LogActivity[]>([]);

    useEffect(() => {
        get('/activities').then((res) => {
            setActivites(res as Activity[]);
        }).catch((err) => {
            console.log(err);
        });


        let date = new Date();
        const offset = date.getTimezoneOffset();
        date = new Date(date.getTime() - (offset*60*1000));
                
        get('/user/activities/' + user?.user_id + '?a_date='+ date.toISOString().slice(0, 10)).then((res) => {
            const activities = res as LogActivity[];
            /*
            const activitiesOnDate = activities.filter((activity) => {
                
                
                if (activity.activity_date.slice(0, 10) == date.toISOString().slice(0, 10)) {
                    return true;
                }
                return false;
            }); */
            setUserActivitiesForDate(activities);
        }).catch((err) => {
            console.log(err);
        });


        get('/schedules?a_date='+date.toISOString().slice(0, 10)).then((res) => {
            setSchedules(res as Schedule[]);
        }).catch((err) => {
            console.log(err);
        });

        get('/user/schedules/'+ user?.user_id + '?a_date='+date.toISOString().slice(0, 10)).then((res) => {
            setUserSchedules(res as UserSchedule[]);
        }).catch((err) => {
            console.log(err);
        });



    }, []);

    const onActivityDateChange = (nextValue: any) => {
        setActivityDate(nextValue);
        get('/user/activities/' + user?.user_id + '?a_date=' +nextValue.toISOString().slice(0, 10)).then((res) => {
            const activities = res as LogActivity[];
            /*
            const activitiesOnDate = activities.filter((activity) => {
                if (activity.activity_date.slice(0, 10) == nextValue.toISOString().slice(0, 10)) {
                    return true;
                }
                return false;
            }); */
            setUserActivitiesForDate(activities);
        }).catch((err) => {
            console.log(err);
        });
    };

    const onClassDateChange = (nextValue: any) => {
        setClassDate(nextValue);

        get('/schedules?a_date='+nextValue.toISOString().slice(0, 10)).then((res) => {
            setSchedules(res as Schedule[]);
        });
        
        get('/user/schedules/'+ user?.user_id + '?a_date='+nextValue.toISOString().slice(0, 10)).then((res) => {
            setUserSchedules(res as UserSchedule[]);
        });
    };

    const showLogHoursOverlay = () => {
        setShowLogHours(true);
    };

    const closeLogHoursOverlay = () => {
        setShowLogHours(false);
    };

    const onLogActivitySubmit = (event: any) => {
        const form = event.currentTarget;
        setLogActivityValidated(true);
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === true) {
            const durInMins = logHours * 60 + logMinutes;
            post('/user/activity/add', {
                user_id: user?.user_id,
                activity_id: logActivity,
                duration: durInMins,
                activity_date: logDate,
            }).then(() => {
                setShowLogHours(false);
                get('/user/activities/' + user?.user_id).then((res) => {
                    const activities = res as LogActivity[];
                    const activitiesOnDate = activities.filter((activity) => {
                        if (activity.activity_date.slice(0, 10) == new Date().toISOString().slice(0, 10)) {
                            return true;
                        }
                        return false;
                    });
                    setUserActivitiesForDate(activitiesOnDate);
                });
            }).catch((err) => {
                console.log(err);
            });
        }

    };

    const getActivityForId = (actId: string) => {
        return activities.find((activity) => {
            return activity.id === parseInt(actId);
        })?.name;
    }
    const parseDuration = (duration: number) => {
        if (duration > 60) {
            const hours = Math.floor(duration/60);
            const mins = duration%60;
            if (hours == 1) {
                return hours + ' hr ' + mins + ' mins';
            }
            return hours + ' hrs ' + mins + ' mins';
        } else {
            return duration + ' mins';
        }
    }

    const getRegistrationStatus = (schedule_id: number) => {
        const found = userSchedules.find((userSchedule) => {
            if (userSchedule.schedule_id === schedule_id) {
                return true;
            }
            return false;
        });

        if (!found) {
            return (<Button variant="dark" size="sm" type="button" onClick={() => registerUserToClass(schedule_id)}>Register</Button>);
        } else {
            return (<Button variant="dark" size="sm" type="button" disabled>Registered</Button>);
        }
    };

    const registerUserToClass = (schedule_id: number) => {
        post('/user/schedule/add', {
                user_id: user?.user_id,
                schedule_id: schedule_id,
            }).then(() => {
                get('/schedules?a_date='+classDate.toISOString().slice(0, 10)).then((res) => {
                    setSchedules(res as Schedule[]);
                });
                
                get('/user/schedules/'+ user?.user_id + '?a_date='+classDate.toISOString().slice(0, 10)).then((res) => {
                    setUserSchedules(res as UserSchedule[]);
                });
            }).catch((err) => {
                console.log(err);
            });
    };

    return(
        <Container>
            <br/>
            <Card bg="light">
                <Card.Header className="text-center" as="h5">View Activities by Date</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>
                            <Calendar
                                onChange={onActivityDateChange}
                                value={activityDate}
                                />
                            </Col>
                            <Col>
                                <Card style={{ minHeight: '100%' }} border="dark">
                                    <Card.Header as="h6" className="text-center">Activities</Card.Header>
                                    <ListGroup className="list-group-flush">
                                        {userActivitiesForDate.map((activity) => {
                                            return(
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col xs={8}>{getActivityForId(activity.activity_id)}</Col>
                                                    <Col>{parseDuration(activity.duration)}</Col>
                                                </Row>
                                            </ListGroup.Item>
                                            );
                                        })}
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </Card.Body>
                <Card.Footer className="text-muted">Click on a date to view activity for the date. Click here to <Button variant="dark" size="sm" onClick={showLogHoursOverlay}>Log Hours</Button></Card.Footer>
            </Card>
            <br/>
            <Card className="text-center" bg="light">
                <Card.Header as="h5">Classes Scheduled by Date</Card.Header>
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
                                            return(
                                                <ListGroup.Item>
                                                    <Row>
                                                        <Col xs={8}>{schedule.name} - {schedule.s_time}</Col>
                                                        <Col>
                                                            {getRegistrationStatus(schedule.id)}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                                );
                                        })}
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </Card.Body>
                <Card.Footer className="text-muted">Click on a date to check your classes scheduled or sign up for them.</Card.Footer>
            </Card>
            <Offcanvas show={showLogHours} onHide={closeLogHoursOverlay} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Log Hours on Activity</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form noValidate validated={logActivityValidated} onSubmit={onLogActivitySubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="activity">Activity</Form.Label>
                                <Form.Select aria-label="Activity" id="activity" onChange={(event) => setLogActivity(event.target.value)}>
                                    {activities.map((activity) => {
                                        return(<option value={activity.id}>{activity.name}</option>);
                                    })}
                                </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="date">Date</Form.Label>
                            <Form.Control type="date" id="date" onChange={(event) => setLogDate(event.target.value)} required />
                            <Form.Control.Feedback type="invalid">Please enter a correct date.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="time">Duration</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control type="number" min="0" max="23" aria-label="hours" onChange={(event) => setLogHours(parseInt(event.target.value))} required/>
                                <InputGroup.Text>Hrs</InputGroup.Text>
                                <Form.Control type="number" min="0" max="59" aria-label="minutes" onChange={(event) => setLogMinutes(parseInt(event.target.value))} required/>
                                <InputGroup.Text>Mins</InputGroup.Text>
                                <Form.Control.Feedback type="invalid">Please enter hours between 0-23 and minutes between 0-59.</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </Container>
    );
};

export default Profile;
