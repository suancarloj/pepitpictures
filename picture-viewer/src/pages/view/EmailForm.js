import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #fff;
  bottom: 0;
  height: 120px;
  left: 0;
  padding: 20px;
  position: absolute;
  right: 0;
  top: calc(50% - 60px);
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

class EmailForm extends Component {
  componentDidMount() {
    this.emailInput.focus();
  }

  render() {
    return (
      <Container>
        <form method="post">
          <Input
            autoComplete="off"
            type="text"
            name="email"
            onChange={(e) => this.props.onEmailChange(e.target.value)}
            ref={(input) => {
              this.emailInput = input;
            }}
            value={this.props.email}
          />
        </form>
      </Container>
    );
  }
}

EmailForm.propTypes = {
  onEmailChange: PropTypes.func.isRequired,
  email: PropTypes.string,
};

export default EmailForm;
