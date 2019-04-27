import { Component } from 'react';
import PropTypes from 'prop-types';

class Socket extends Component {
  componentDidMount() {
    const { subscribeTopic } = this.props;
    if (subscribeTopic) {
      const topics = Array.isArray(subscribeTopic) ? subscribeTopic : [subscribeTopic];
      topics.forEach((topic) => {
        this.props.socket.on(topic, (data) => {
          console.log(topic, ':', data);
          this.props.subscribeCallback(topic, data);
        });
      })
    }
  }

  push = (topic, data) => {
    console.log(topic, ':', data);
    this.props.socket.emit(topic, data);
  };

  render() {
    return this.props.children({ push: this.push });
  }
}

Socket.propTypes = {
  children: PropTypes.func,
  subscribeTopic: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  subscribeCallback: PropTypes.func,
};

export default Socket;
