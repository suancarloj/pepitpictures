import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { setPicturesEmail } from './services/pictures';
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
    transition: all 0.2s
  }
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;
`;

class App extends Component {
  static propTypes = {
    computerId: PropTypes.string.isRequired,
    createNewPictureSet: PropTypes.func.isRequired,
    pictureSetId: PropTypes.string.isRequired,
  };

  state = {
    email: '',
  };

  handleShowEmailPopupClick = () => {
    alert('foo');
  };

  handleSubmitEmail = (e) => {
    e.preventDefault();
    setPicturesEmail(this.props.pictureSetId, this.state.email)
      .then(() => this.setState({ email: '' }));
  };

  render() {
    const { computerId, pictureSetId, createNewPictureSet } = this.props;
    const shortSetId = pictureSetId.substr(12);
    return (
      <Container>
        <span className="card-title activator grey-text text-darken-4">
          PC {computerId} - {shortSetId}
          <i className="mdi-navigation-more-vert right" />
        </span>
        <Form method="post" onSubmit={this.handleSubmitEmail}>
          <input
            onChange={(e) => this.setState({ email: e.target.value })}
            name="email"
            type="email"
            value={this.state.email}
            required
          />
          <SaveButton>Save</SaveButton>
        </Form>
        <ActionContainer>
          <Socket
            host={ConfigProvider.apiBasePath + `?room=computer-${this.props.computerId}`}
            registerId={this.props.computerId}
          >
            {({ push }) => (
              <Button onClick={() => push('show-email-popup', true)} type="button">
                Show email
              </Button>
            )}
          </Socket>
          <Button onClick={createNewPictureSet} type="button" style={{ padding: '0 18px' }}>
            Close
          </Button>
        </ActionContainer>
      </Container>
    );
  }
}

export default App;
