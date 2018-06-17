import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.png';
import styled from 'styled-components';


const Header = styled.header`
  text-align: center;
  padding: 30px;
`;

const Logo = styled.img`
  margin: 0 auto;
  max-width: 246px;
  max-height: 244px;
`;

const Separator = styled.hr`
  border-style: none;
  border-bottom: 1px solid rgb(240, 240, 240);
  max-width: 800px;
`;


class Layout extends Component {
  render() {
    return (
      <div>
        <Header>
          <Logo src={logo} alt="logo" />
        </Header>
        <Separator />
        {this.props.children}
      </div>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;