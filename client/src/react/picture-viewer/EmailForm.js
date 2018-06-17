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

function EmailForm(props) {
  return (
    <Container>
      <form onSubmit={props.onSubmit} method="post">
        <Input
          autocomplete="off"
          type="text"
          name="email"
          onChange={(e) => props.onEmailChange(e.target.value)}
          value={props.email}
        />
        <Button className="btn btn-large">Save</Button>
      </form>
    </Container>
  );
}

EmailForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  email: PropTypes.string,
};

export default EmailForm;
