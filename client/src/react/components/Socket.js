import React, { Component } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

class Socket extends Component {
  constructor(props) {
    super(props);
    this.socket = io.connect(props.host);
  }
  componentDidMount() {
    const { subscribeTopic } = this.props;
    if (subscribeTopic) {
      const topics = Array.isArray(subscribeTopic) ? subscribeTopic : [subscribeTopic];
      topics.forEach((topic) => {
        this.socket.on(topic, (data) => {
          this.props.subscribeCallback(topic, data);
        });
      })
    }

  }

  push = (topic, data) => {
    this.socket.emit(topic, data);
  };

  render() {
    return this.props.children({ push: this.push });
  }
}

Socket.propTypes = {
  children: PropTypes.func,
  host: PropTypes.string.isRequired,
  subscribeTopic: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  subscribeCallback: PropTypes.func,
};

export default Socket;
