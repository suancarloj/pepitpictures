import React, { Component } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

class Socket extends Component {
  constructor(props) {
    super(props);
    this.socket = io.connect(props.host);
  }
  componentDidMount() {
    if (this.props.subscribeTopic)
      this.socket.on(this.props.subscribeTopic, this.props.subscribeCallback);
  }

  push = (topic, data) => this.socket.emit(topic, data)

  render() {
    if (this.props.subscribeTopic && this.props.subscribeCallback) {
      return null;
    }
    return this.props.children({ push: this.push });
  }
}

Socket.propTypes = {
  children: PropTypes.func,
  host: PropTypes.string.isRequired,
  subscribeTopic: PropTypes.string,
  subscribeCallback: PropTypes.func,
};

export default Socket;
