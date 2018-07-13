import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import { basePath, publishPictures, setPicturesEmail } from '../../services/pictures';
import Socket from '../../components/Socket';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const Form = styled.form`
  display: flex;
  padding: 0 8px 0 0;
`;

const Button = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid rgba(30, 179, 188, 0.7);
  border-radius: 3px;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: inline;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 21px;
  margin: 10px 5px;
  padding: 3px 16px;
  text-align: left;
  text-decoration-color: rgba(0, 0, 0, 0.5);
  text-decoration-line: none;
  text-decoration-style: solid;
  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    margin-right: 0;
  }
  &:hover:enabled {
    background-color: rgba(30, 179, 188, 0.7);
    color: #fff;
  }
  &:disabled {
    border: 1px solid rgba(204, 204, 204, 0.7);
  }
`;

const ActionContainer = styled.div`
  box-sizing: border-box;
  padding: 0 8px;
  width: 100%;
  div {
    display: flex;
    justify-content: flex-start;
  }
`;

const HandlerTitle = styled.h2`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-transform: uppercase;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.5);
`;

const Hr = styled.hr`
  background-color: rgba(0, 0, 0, 0.1);
  border: 0;
  clear: both;
  display: block;
  height: 1px;
  margin-top: 0;
  width: 100%;
`;

const EmailInput = styled.input`
  border-radius: 3px;
  border: 1px solid rgba(30, 179, 188, 0.7);
  height: 25px;
  margin-top: 10px;
  width: 100%;
  &::placeholder {
    opacity: 0.5;
  }
`;


class ScreenHandler extends Component {
  static propTypes = {
    computerId: PropTypes.string.isRequired,
    createNewPictureSet: PropTypes.func.isRequired,
    pictureSetId: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.handleSubmitEmail = debounce(this.handleSubmitEmail, 300);
  }

  state = {
    collectionId: null,
    email: '',
    emailSaved: false,
    published: false,
    publishing: false,
    showEmailToggle: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.collectionId !== nextProps.pictureSetId) {
      return {
        collectionId: nextProps.pictureSetId,
        email: '',
        emailSaved: false,
        published: false,
        publishing: false,
        showEmailToggle: false,
      }
    }
    return prevState;
  }

  handleSubmitEmail = (push, email) => {
    setPicturesEmail(this.props.pictureSetId, email).then(() => {
      this.setState({ emailSaved: true });
    });
  };

  handleCloseSet = (push) => () => {
    this.props.createNewPictureSet();
    push('show-email-popup', false);
    this.setState({ email: '' });
  };

  handlePublishPictures = (push) => {
    this.setState({ publishing: true });
    publishPictures(this.props.pictureSetId).then(() => {
      setTimeout(() => {
        this.setState({ published: true, publishing: false });
      }, 2000);
      this.handleCloseSet(push)();
    })
    .catch((err) => {
      this.setState({ publishing: false, published: false });
      alert('Email invalid please try again')
    });
  };

  render() {
    const { computerId, pictureSetId = '' } = this.props;
    const shortSetId = pictureSetId.substr(12);
    return (
      <Socket
        host={`${basePath}?room=computer-${this.props.computerId}`}
        subscribeCallback={(_, email) => this.setState({ email, emailSaved: true })}
        subscribeTopic="live-email-change"
        registerId={this.props.computerId}
      >
        {({ push }) => (
          <Container>
            <HandlerTitle>
              PC {computerId} - {shortSetId}
            </HandlerTitle>
            <Hr />
            <ActionContainer>
              <div>
                <Button
                  onClick={() => {
                    this.setState({ showEmailToggle: !this.state.showEmailToggle });
                    push('show-email-popup', !this.state.showEmailToggle);
                  }}
                  type="button"
                >
                  {this.state.showEmailToggle ? 'Hide email' : 'Show email'}
                </Button>
                <Button
                  disabled={!this.state.emailSaved || this.state.publishing}
                  onClick={() => this.handlePublishPictures(push)}
                  type="button"
                >
                  {this.state.publishing ? 'Email on the way...' : 'Send email'}
                </Button>
              </div>

              <div>
                <Form method="post">
                  <EmailInput
                    onChange={(e) => {
                      push('live-email-change', { pictureSetId, email: e.target.value });
                      this.setState({ email: e.target.value, emailSaved: false });
                      this.handleSubmitEmail(push, e.target.value);
                    }}
                    name="email"
                    placeholder="mail@example.com"
                    type="email"
                    value={this.state.email}
                  />
                </Form>
                <Button
                  onClick={this.handleCloseSet(push)}
                  type="button"
                  style={{ paddingLeft: '15px', paddingRight: '15px' }}
                >
                  Close
                </Button>
              </div>
            </ActionContainer>
          </Container>
        )}
      </Socket>
    );
  }
}

export default ScreenHandler;
