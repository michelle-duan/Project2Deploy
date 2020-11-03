import React from "react";
import { ButtonToolbar, Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import "./style/navigation-bar.css";

import { NavLink } from "react-router-dom";
import { Row, Col, Menu } from "antd";
import HomeOutlined from "@ant-design/icons";
//import "./style/antStyle.less";

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
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

  handleLogout(event) {
    event.preventDefault();
    const cookies = new Cookies();
    cookies.remove("pwLoggedIn");
    this.setState({
      loggedIn: false,
    });
  }

  render() {
    let rightCornerContent = null;
    if (this.state.loggedIn) {
      rightCornerContent = (
        <div>
          <Button
            className={"mx-1"}
            variant={"primary"}
            onClick={(e) => this.handleLogout(e)}
          >
            Logout
          </Button>
          <a href="/user-profile">
            <img id={"rightCornerIcon"} src="/images/avatar.svg" alt="" />
          </a>
        </div>
      );
    } else {
      rightCornerContent = (
        <ButtonToolbar>
          <Button className={"mx-1"} variant={"primary"} href={"/register"}>
            Register
          </Button>
          <img id={"rightCornerIcon"} src="/images/avatar.svg" alt="" />
          <Button className={"mx-1"} variant={"success"} href={"/login"}>
            Sign in
          </Button>
        </ButtonToolbar>
      );
    }

    return (
      <Row>
        <Col sm={14} md={10} lg={8} xl={6}>
          <div className="brand">
            <img
              src="https://res.cloudinary.com/masterchef/image/upload/v1599206804/icon_jzvahe.png"
              alt="icon"
              style={{ width: "4rem", marginRight: "20px" }}
            />
            Pettube
          </div>
        </Col>

        {/* Menu */}
        <Col sm={2} md={3} lg={5} xl={3}>
          {/* <Menu theme="dark" mode="horizontal"> */}
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ background: "#fcaf58" }}
          >
            <Menu.Item key="1" className="select">
              <HomeOutlined />
              <span>
                <NavLink to="/">Home</NavLink>
              </span>
            </Menu.Item>

            {/* <Menu.Item key="3">
            <AboutModal />
          </Menu.Item> */}
          </Menu>
        </Col>

        <Col className="sign-in" sm={2} md={3} lg={10} xl={14}>
          {rightCornerContent}
        </Col>
      </Row>
    );
    // return (
    //   <Navbar bg="light" expand="lg">
    //     <Navbar.Brand href="/">Pet Website</Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse id="basic-navbar-nav">
    //       <Nav className="mr-auto">
    //         <Nav.Link href="/">Homepage</Nav.Link>
    //       </Nav>
    //       {rightCornerContent}
    //     </Navbar.Collapse>
    //   </Navbar>
    // );
  }
}

export default NavigationBar;
