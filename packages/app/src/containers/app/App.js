import React, { Component } from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  height: 100%;
`;

const GridSection = styled.div`
  align-items: center;
  color: #fff;
  background-color: ${props => props.backgroundColor};
  display: flex;
  flex-direction: center;
  justify-content: center;
`;

class App extends Component {
  render() {
    return (
      <Grid>
        <GridSection backgroundColor="#FACCE1">1</GridSection>
        <GridSection backgroundColor="#F0EDE1">4</GridSection>
        <GridSection backgroundColor="#B4C0B8">3</GridSection>
        <GridSection backgroundColor="#F8D7D6">2</GridSection>
      </Grid>
    );
  }
}

export default App;
