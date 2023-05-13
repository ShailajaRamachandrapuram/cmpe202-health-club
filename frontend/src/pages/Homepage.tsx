import { get } from '../services/Rest';
import { useEffect, useState } from 'react';
import { Alert, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { Schedule } from "./Profile";

export interface Membership {
    id: number;
    name: string;
    location: number;
    cost: string;
    duration: string;
};

interface HomepageProps {
    location: number;
};

function Homepage(props: HomepageProps) {

    const [showErrAlert, setShowErrAlert] = useState<boolean>(false);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [value, setValue] = useState(new Date());

    const [schedules, setSchedules] = useState<Schedule[]>([]);

    function onChange(nextValue: any) {
        setValue(nextValue);
        get('/schedules?a_date='+nextValue.toISOString().slice(0, 10)).then((res) => {
            setSchedules(res as Schedule[]);
        });
    }

    useEffect(() => {
        get('/memberships?loc_id=' + props.location).then((res: Membership[]) => {
            setShowErrAlert(false);
            setMemberships(res);
        }).catch((err) => {
            err.json().then((res: any) => {
                setShowErrAlert(true);
            });
        });
    }, [props.location]);

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

    return(
        <Container>
            <br/>
            {showErrAlert && <Alert variant='danger' onClose={() => setShowErrAlert(false)} dismissible>
                <Alert.Heading>Login Error!</Alert.Heading>
                <p>There was an error while logging the user. Please try again!</p>
            </Alert>}
            <Card className="text-center" bg="light">
                <Card.Header as="h5">Available Memberships</Card.Header>
                    <Card.Body>
                        <Row xs={1} md={3}>
                            {memberships.map((membership) => {
                                return (<Col>
                                    <Card style={{ width: '18rem', minHeight: '12rem', marginBottom: '1rem' }} border="dark">
                                    <Card.Header as="h6">{membership.name}</Card.Header>
                                        <Card.Body>
                                            <Card.Text style={{ textAlign: 'left' }}>
                                                <b>Cost: </b> {membership.cost} <br/>
                                                <b>Duration: </b> {membership.duration}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>);
                            })}
                        </Row>
                    </Card.Body>
                <Card.Footer className="text-muted">Please ask a <b>Health Club</b> employee at the gym counter to set you up with a membership</Card.Footer>
            </Card>
            <br/>
            <Card className="text-center" bg="light">
                <Card.Header as="h5">Classes Scheduled by Date</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col>
                            <Calendar
                                onChange={onChange}
                                value={value}
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
                                </Card>
                            </Col>
                        </Row>
                    </Card.Body>
                <Card.Footer className="text-muted">Please login to signup for classes in advance.</Card.Footer>
            </Card>
        </Container>
    );
}

export default Homepage;