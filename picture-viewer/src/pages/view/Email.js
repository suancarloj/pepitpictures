import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Socket from '../../components/Socket';
import { basePath } from '../../services/collection';
import EmailForm from './EmailForm';

class Email extends Component {
  static propTypes = {
    computerId: PropTypes.string.isRequired,
    pictureSetId: PropTypes.string.isRequired,
  };

  state = {
    email: '',
    pictureSetId: null,
    showEmailForm: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.pictureSetId === nextProps.pictureSetId) {
      return null;
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
  };

  render() {
    return (
      <Fragment>
        <Socket
          host={`${basePath}?room=computer-${this.props.computerId}`}
          registerId={this.props.computerId}
          subscribeCallback={this.handleSubscribe}
          subscribeTopic={['show-email-popup', 'live-email-change']}
        >
          {({ push }) =>
            this.state.showEmailForm && (
              <EmailForm
                email={this.state.email}
                onEmailChange={(email) => {
                  this.setState({ email });
                  push('live-email-change', { pictureSetId: this.props.pictureSetId, email });
                }}
                pictureSetId={this.state.pictureSetId}
              />
            )
          }
        </Socket>
      </Fragment>
    );
  }
}

export default Email;
