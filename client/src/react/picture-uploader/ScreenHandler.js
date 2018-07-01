import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import { publishPictures, setPicturesEmail } from '../services/pictures';
import Socket from '../components/Socket';
import ConfigProvider from '../../angular/common/ConfigProvider';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  padding: 0 8px;
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

const SaveButton = Button.extend`
  padding-left: 20px;
  padding-right: 20px;
  &:focus {
    background-color: rgba(3, 155, 229, 0.1);
    transition: all 0.2s;
  }
  &:disabled {
    color: #ccc;
    opacity: 60%;
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

const EmailContainer = styled.div`
  padding: 0 8px;
  button {
    margin-left: 16px;
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
  margin-right: 10px;
  margin-top: 10px;
  &::placeholder {
    opacity: 0.5;
  }
`;

const ReadOnlyEmailContainer = styled.span`
  color: rgba(0, 0, 0, 0.5);
  font-family: Roboto, sans-serif;
  font-size: 13px;
  margin-right: 10px;
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
    email: '',
    emailSaved: false,
    published: false,
    publishing: false,
    showEmailToggle: false,
  };

  handleSubmitEmail = (push, email) => {
    setPicturesEmail(this.props.pictureSetId, email).then(() => {
      this.setState({ emailSaved: true });
      push('show-email-popup', false);
    });
  };

  handleCloseSet = (push) => () => {
    this.props.createNewPictureSet();
    push('show-email-popup', false);
    this.setState({ email: '' });
  };

  handlePublishPictures = () => {
    this.setState({ publishing: true });
    publishPictures(this.props.pictureSetId).then(() => {
      this.setState({ published: true, publishing: false });
    });
  };

  render() {
    const { computerId, pictureSetId } = this.props;
    const shortSetId = pictureSetId.substr(12);
    return (
      <Socket
        host={ConfigProvider.apiBasePath + `?room=computer-${this.props.computerId}`}
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
                    this.setState({ showEmailToggle: !this.state.showEmailToggle })
                    push('show-email-popup', !this.state.showEmailToggle);
                  }}
                  type="button"
                >
                  {this.state.showEmailToggle ? 'Hide email' : 'Show email'}
                </Button>
                <Button
                  onClick={this.handleCloseSet(push)}
                  type="button"
                  style={{ padding: '0 18px' }}
                >
                  Close
                </Button>
              </div>

              <div>
                <Button
                  disabled={!this.state.emailSaved}
                  onClick={this.handlePublishPictures}
                  type="button"
                >
                  Send email
                </Button>
              </div>
            </ActionContainer>

            <Form method="post">
              <EmailInput
                onChange={(e) => {
                  push('live-email-change', e.target.value);
                  this.setState({ email: e.target.value, emailSaved: false });
                  this.handleSubmitEmail(push, e.target.value);
                }}
                name="email"
                placeholder="mail@example.com"
                type="email"
                value={this.state.email}
              />
            </Form>
          </Container>
        )}
      </Socket>
    );
  }
}

export default ScreenHandler;
