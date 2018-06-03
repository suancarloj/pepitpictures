import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Socket from '../components/Socket';
import ConfigProvider from '../../angular/common/ConfigProvider';
import EmailForm from './EmailForm';

class Email extends Component {
  state = {
    showEmailForm: false,
  };
  handleSubscribe = (data) => {
    this.setState({ showEmailForm: data });
  }
  render() {
    return (
      <Fragment>
        <Socket
          host={ConfigProvider.apiBasePath + `?room=computer-${this.props.computerId}`}
          registerId={this.props.computerId}
          subscribeCallback={this.handleSubscribe}
          subscribeTopic="show-email-popup"
        />
        {this.state.showEmailForm && <EmailForm pictureSetId={this.props.pictureSetId} />}
      </Fragment>
    );
  }
}

Email.propTypes = {
  computerId: PropTypes.string.isRequired,
  pictureSetId: PropTypes.string.isRequired,
};

export default Email;
