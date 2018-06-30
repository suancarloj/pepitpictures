import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { publishPictures, setPicturesEmail } from './services/pictures';
import Socket from './components/Socket';
import ConfigProvider from '../angular/common/ConfigProvider';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
`;

const Button = styled.button`
  background-color: rgba(0, 0, 0, 0);
  box-sizing: border-box;
  color: rgb(3, 155, 229);
  cursor: pointer;
  display: inline;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  margin: 10px 0;
  padding: 0;
  text-align: left;
  text-decoration-color: rgb(3, 155, 229);
  text-decoration-line: none;
  text-decoration-style: solid;
  border: 0;
  &:focus {
    background-color: transparent;
  }
`;

const SaveButton = Button.extend`
  padding: 0 20px;
  margin-left: 10px;
  &:hover {
    opacity: 110%;
  }
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
  display: flex;
  justify-content: space-between;

  width: 100%;
`;

const EmailContainer = styled.div`
  height: 61px;
  line-height: 61px;
  button {
    margin-left: 16px;
  }
`;

class App extends Component {
  static propTypes = {
    computerId: PropTypes.string.isRequired,
    createNewPictureSet: PropTypes.func.isRequired,
    pictureSetId: PropTypes.string.isRequired,
  };

  state = {
    email: '',
    emailSaved: false,
    published: false,
    publishing: false,
    showEmailForm: false,
  };

  handleSubmitEmail = (push) => (e) => {
    e.preventDefault();
    setPicturesEmail(this.props.pictureSetId, this.state.email).then(() => {
      this.setState({ showEmailForm: false, emailSaved: true });
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
      <Container>
        <span className="card-title activator grey-text text-darken-4">
          PC {computerId} - {shortSetId}
          <i className="mdi-navigation-more-vert right" />
        </span>
        <Socket
          host={ConfigProvider.apiBasePath + `?room=computer-${this.props.computerId}`}
          subscribeCallback={(_, email) => this.setState({ email })}
          subscribeTopic="live-email-change"
          registerId={this.props.computerId}
        >
          {({ push }) => (
            <Fragment>
              {this.state.showEmailForm ? (
                <Form method="post" onSubmit={this.handleSubmitEmail(push)}>
                  <input
                    onChange={(e) => {
                      push('live-email-change', e.target.value);
                      this.setState({ email: e.target.value, emailSaved: false });
                    }}
                    name="email"
                    type="email"
                    value={this.state.email}
                    required
                  />
                  <SaveButton disabled={this.state.emailSaved}>Save</SaveButton>
                </Form>
              ) : (
                <EmailContainer>
                  {this.state.email}
                  {this.state.emailSaved && (
                    <Button onClick={this.handlePublishPictures} type="button">
                      Send email
                    </Button>
                  )}
                </EmailContainer>
              )}
              <ActionContainer>
                <Button
                  onClick={() => {
                    this.setState({ showEmailForm: true });
                    push('show-email-popup', true);
                  }}
                  type="button"
                >
                  Display on screen {this.props.computerId}
                </Button>
                <Button
                  onClick={this.handleCloseSet(push)}
                  type="button"
                  style={{ padding: '0 18px' }}
                >
                  Close
                </Button>
              </ActionContainer>
            </Fragment>
          )}
        </Socket>
      </Container>
    );
  }
}

export default App;
