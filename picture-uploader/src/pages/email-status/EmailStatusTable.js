import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import format from 'date-fns/format';
import { getPictures, publishPictures } from '../../services/pictures';

const Table = styled.table`
  border-collapse: collapse;
  color: rgba(0, 0, 0, 0.6);
  font-family: Roboto, sans-serif;
  font-size: 12px;
  width: 100%;
  tr {
    height: 30px;
    &.alternate {
      background-color: rgb(114, 30, 188, 0.05);
    }
  }
`;

const Button = styled.button`
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  /* border: 1px solid rgba(30, 179, 188, 0.7); */
  border-radius: 3px;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: inline-block;
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 400;
  margin-left: 10px;
  margin-top: 5px;
  padding: 3px 16px;
  text-align: left;
  text-decoration-color: rgba(0, 0, 0, 0.5);
  text-decoration-line: none;
  text-decoration-style: solid;

  &:hover:enabled {
    background-color: rgba(30, 179, 188, 0.7);
    color: #fff;
  }
  &:disabled {
    border: 1px solid rgba(204, 204, 204, 0.7);
  }
`;

const Container = styled.div`
  padding: 10px;
`;

class EmailStatusTable extends Component {
  state = {
    collections: [],
    page: 0,
    published: false,
    publishing: false,
  };

  componentDidMount() {
    this.getAllPictureColection();
  }

  getAllPictureColection = () => {
    getPictures(null, 200).then((res) => {
      this.setState({ collections: res.docs });
    });
  };

  handlePublishPictures = (collectionId) => {
    this.setState({ publishing: collectionId });
    publishPictures(collectionId).then(() => {
      setTimeout(() => {
        this.setState({ published: true, publishing: false });
      }, 2000);
    });
  };

  render() {
    return (
      <Container>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>TIME</th>
              <th>EMAIL</th>
              <th>PICTURES</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {this.state.collections.map((collection, idx) => {
              const countStared = collection.pictures.filter((p) => p.stared).length;
              return (
                <tr className={idx % 2 === 0 ? 'alternate' : ''} key={idx}>
                  <td>{collection._id}</td>
                  <td>{format(collection.createdAt, 'HH:mm DD-MM')}</td>
                  <td>{collection.email || '--'}</td>
                  <td>
                    {countStared} / {collection.pictures.length}
                  </td>
                  <td>
                    {collection.email && (
                      <Button
                        disabled={this.state.publishing}
                        onClick={() => this.handlePublishPictures(collection._id)}
                        type="button"
                      >
                        {this.state.publishing === collection._id ? 'sending.....' : 'Send email'}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    );
  }
}

EmailStatusTable.propTypes = {};

export default EmailStatusTable;
