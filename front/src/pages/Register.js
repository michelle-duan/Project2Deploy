import React from "react";
import axios from "axios";
import Cookie from "universal-cookie";
import { Redirect } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import "./style/register.css";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      validPassword: null,
      jumpToUpdateProfile: null,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.validPassword) {
      this.postDataToDB();
    }
  }

  handleOnChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(
      {
        [name]: value,
      },
      () => {
        if (
          this.state.password !== undefined &&
          this.state.password !== null &&
          this.state.password !== "" &&
          this.state.confirmPassword !== undefined &&
          this.state.confirmPassword !== null &&
          this.state.confirmPassword !== ""
        ) {
          if (this.state.password === this.state.confirmPassword) {
            this.setState({
              validPassword: true,
            });
          } else {
            this.setState({
              validPassword: false,
            });
          }
        }
      }
    );
  }

  postDataToDB() {
    axios
      .post("/users/register", {
        data: {
          email: this.state.email,
          username: this.state.username,
          password: this.state.password,
        },
      })
      .then(() => {
        const cookie = new Cookie();
        cookie.set("pwLoggedIn", this.state.email);
        this.setState({
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          jumpToUpdateProfile: true,
        });
      })
      .catch((error) => {
        this.setState({
          status: error.toString(),
        });
      });
  }

  render() {
    let alert = null;
    if (this.state.validPassword === true) {
      alert = <Alert variant={"success"}>Password is valid. </Alert>;
    }
    if (this.state.validPassword === false) {
      alert = <Alert variant={"warning"}>Passwords are not the same. </Alert>;
    }
    if (this.state.jumpToUpdateProfile) {
      return <Redirect to={{ pathname: "/" }} />;
    } else {
      return (
        <div>
          <NavigationBar />
          <Container>
            <Row>
              <Col className={"text-center my-4"}>
                <h1>Register</h1>
              </Col>
            </Row>
            <Form onSubmit={(e) => this.handleSubmit(e)}>
              <Row>
                <Col lg={"12"}>
                  <Form.Group controlId={"email"}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name={"email"}
                      value={this.state.email}
                      type={"email"}
                      placeholder={"example@server.com"}
                      onChange={(e) => this.handleOnChange(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={"12"}>
                  <Form.Group controlId={"username"}>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      name={"username"}
                      value={this.state.username}
                      type={"input"}
                      placeholder={"username"}
                      onChange={(e) => this.handleOnChange(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={"12"}>
                  <Form.Group controlId={"password"}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name={"password"}
                      value={this.state.password}
                      type={"password"}
                      placeholder={"password"}
                      onChange={(e) => this.handleOnChange(e)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={"12"}>
                  <Form.Group controlId={"confirmPassword"}>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      name={"confirmPassword"}
                      value={this.state.confirmPassword}
                      type={"password"}
                      placeholder={"confirm password"}
                      onChange={(e) => this.handleOnChange(e)}
                    />
                  </Form.Group>
                </Col>
                <Col>{alert}</Col>
              </Row>
              <Button variant={"primary"} type={"submit"}>
                Submit
              </Button>
            </Form>
          </Container>
        </div>
      );
    }
  }
}

export default Register;
