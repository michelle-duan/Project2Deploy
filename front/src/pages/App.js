import React from "react";
import "./App.css";

import Jumbo from "./Jumbotron.js";

import NavigationBar from "./NavigationBar.js";

import axios from "axios";
import { Row } from "react-bootstrap";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoList: [],
    };
  }

  componentDidMount() {
    axios.get("/videos/list", {}).then((response) => {
      this.setState({
        videoList: response.data, //后端叫resul t，前端叫response.data
      });
    });
  }

  render() {
    const links = this.state.videoList.map((value, index) => {
      return (
        <li key={index} style={{ "text-align": "center" }}>
          <h2 style={{ "text-align": "center" }}>
            <span className="span_color">
              <a href={"/videos/" + value.id} style={{ color: "black" }}>
                {value.name} (Click to add your comments!)
              </a>
            </span>
          </h2>
          <iframe
            width="490"
            height="300"
            src={value.url}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </li>
      );
    });
    return (
      <div>
        <NavigationBar />
        <Jumbo />

        <Row>
          <ul>{links}</ul>
        </Row>
      </div>
    );
  }
}

export default App;
