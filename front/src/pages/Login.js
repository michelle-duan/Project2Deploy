import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import Cookies from "universal-cookie";
import Button from "react-bootstrap/Button";
import NavigationBar from "./NavigationBar";
import "./style/login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      email: "",
      password: "",
    };
  }

  handleOnChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      [name]: value,
    });
  }

  handleOnSubmit(event) {
    event.preventDefault();
    axios
      .post("/users/authenticate", {
        data: {
          email: this.state.email,
          password: this.state.password,
        },
      })
      .then((response) => {
        if (response.data.match) {
          const cookies = new Cookies();
          cookies.set("pwLoggedIn", this.state.email);
        }
        this.setState({
          loggedIn: response.data.match,
          email: "",
          password: "",
        });
      });
  }

  componentDidMount() {
    const cookies = new Cookies();
    const token = cookies.get("pwLoggedIn");
    if (token !== undefined && token !== null && token !== "") {
      this.setState({
        loggedIn: true,
      });
    } else {
      this.setState({
        loggedIn: false,
      });
    }
  }

  render() {
    if (this.state.loggedIn) {
      return <Redirect to={"/"} />;
    } else {
      return (
        <div>
          <NavigationBar />
          <Container>
            <Row>
              <Col className={"my-4"} lg={"12"}>
                <h1>Sign In</h1>
              </Col>
            </Row>
            <Form onSubmit={(e) => this.handleOnSubmit(e)}>
              <Form.Row>
                <Col lg={"12"}>
                  <Form.Group controlId={"formEmail"}>
                    <Form.Label>Email: </Form.Label>
                    <Form.Control
                      as={"input"}
                      type={"text"}
                      name={"email"}
                      value={this.state.email}
                      onChange={(e) => this.handleOnChange(e)}
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col lg={"12"}>
                  <Form.Group controlId={"formPassword"}>
                    <Form.Label>Password: </Form.Label>
                    <Form.Control
                      as={"input"}
                      type={"password"}
                      name={"password"}
                      value={this.state.password}
                      onChange={(e) => this.handleOnChange(e)}
                    />
                  </Form.Group>
                </Col>
              </Form.Row>
              <Form.Row>
                <Col lg={"12"}>
                  <Button variant={"primary"} type={"submit"}>
                    Submit
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </Container>
        </div>
      );
    }
  }
}

export default Login;
