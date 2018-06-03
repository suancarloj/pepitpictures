import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #fff;
  height: 120px;
  padding: 20px;
  width: 100%;
  z-index: 10;
  form {
    align-items: center;
    display: flex;
    justify-content: center;
  }
`;

const Input = styled.input`
  font-size: 60px !important;
  height: 80px !important;
  text-align: center;
`;

const Button = styled.button`
  margin: 0 0 0 20px;
`;

class EmailForm extends Component {
  state = {
    email: '',
  };

  handleSubmit = (e) => {
    e.preventDefault();
    setPicturesEmail(this.props.pictureSetId, this.state.email)
      .then(() => this.setState({ email: '' }));
  };

  render() {
    return (
      <Container>
        <form onSubmit={this.handleSubmit} method="post">
          <Input
            autocomplete="off"
            type="text"
            name="email"
            onChange={(e) => this.setState({ email: e.target.value })}
            value={this.state.value}
          />
          <Button className="btn btn-large">Save</Button>
        </form>
        {/* {JSON.stringify(this.props)} */}
      </Container>
    );
  }
}

EmailForm.propTypes = {};

export default EmailForm;
