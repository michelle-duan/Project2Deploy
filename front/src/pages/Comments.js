import React from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./style/comments.css";

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
    };
  }

  componentDidMount() {
    axios
      .get("/videos/getComments", {
        params: {
          videoId: this.props.videoId,
        },
      })
      .then((response) => {
        console.log(response.data);
        this.setState({
          comments: response.data,
        });
      });
  }

  renderComments() {
    let content = null;
    if (this.state.comments.length <= 0) {
      content = <div></div>;
    } else {
      content = this.state.comments.map((value, index) => {
        return (
          <div key={index}>
            <hr />
            <Row>
              <Col col={"3"}>
                <h5>{value.userToken}</h5>
              </Col>
              <Col col={"3"}>
                <h5>{value.time}</h5>
              </Col>
            </Row>
            <Row className={"mb-3"}>
              <Col col={"12"}>
                <p>{value.comment}</p>
              </Col>
            </Row>
          </div>
        );
      });
    }
    return content;
  }

  render() {
    return this.renderComments();
  }
}

Comments.propTypes = {
  videoId: PropTypes.string.isRequired,
};

export default Comments;
