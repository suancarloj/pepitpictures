import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Socket from '../components/Socket';
import ConfigProvider from '../../angular/common/ConfigProvider';
import EmailForm from './EmailForm';
import { setPicturesEmail } from '../services/pictures'

class Email extends Component {
  static propTypes = {
    computerId: PropTypes.string.isRequired,
    pictureSetId: PropTypes.string.isRequired,
  }

  state = {
    email: '',
    pictureSetId: null,
    showEmailForm: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.pictureSetId === nextProps.pictureSetId) {
      return null
    }

    return {
      email: '',
      pictureSetId: nextProps.pictureSetId,
      showEmailForm: false,
    };
  }

  handleSubscribe = (topic, data) => {
    switch (topic) {
      case 'show-email-popup':
        this.setState({ showEmailForm: data });
        break;
      case 'live-email-change':
        this.setState({ email: data });
        break;
      default:
        break;
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    setPicturesEmail(this.props.pictureSetId, this.state.email)
      .then(() => {
        this.setState({ email: '', showEmailForm: false })
      });
  };

  render() {
    return (
      <Fragment>
        <Socket
          host={`${ConfigProvider.apiBasePath}?room=computer-${this.props.computerId}`}
          registerId={this.props.computerId}
          subscribeCallback={this.handleSubscribe}
          subscribeTopic={['show-email-popup', 'live-email-change']}
        >
          {({ push }) => this.state.showEmailForm && (
            <EmailForm
              email={this.state.email}
              onEmailChange={(val) => {
                this.setState({ email: val });
                push('live-email-change', val);
              }}
              onSubmit={this.handleSubmit}
              pictureSetId={this.state.pictureSetId}
            />
          )}
        </Socket>
      </Fragment>
    );
  }
}

export default Email;
