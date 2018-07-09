import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import format from 'date-fns/format';
import { getPictures, publishPictures } from '../../services/pictures';
import Modal from '../../components/Modal';

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

const ReloadButton = styled.button`
  border-style: none;
  position: absolute;
  top: 10px;
  left: 50%;
`;

const emailStatus ={
  ERROR: <svg xmlns="http://www.w3.org/2000/svg" height="10px" width="10px" viewBox="0 0 576 512"><path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" fill="#ff0000"/></svg>,
  NOT_SENT: null,
  PENDING: 'PENDING',
  SENT: <svg xmlns="http://www.w3.org/2000/svg" height="10px" width="10px" viewBox="0 0 512 512"><path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" fill="rgb(30, 179, 188)"/></svg>,
}

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

  handleCloseModal = () => {
    this.props.history.push('/');
  }

  handlePublishPictures = (collectionId) => {
    this.setState({ publishing: collectionId });
    publishPictures(collectionId).then(() => {
      this.getAllPictureColection();
      setTimeout(() => {
        this.setState({ published: true, publishing: false });
      }, 2000);
    });
  };

  render() {
    return (
      <Modal onClickOutside={this.handleCloseModal}>
        <ReloadButton onClick={this.getAllPictureColection}>
          <svg xmlns="http://www.w3.org/2000/svg" height="12px" width="12px" viewBox="0 0 512.333 512"><path d="M500.333 0h-47.411c-6.853 0-12.314 5.729-11.986 12.574l3.966 82.759C399.416 41.899 331.672 8 256.001 8 119.34 8 7.899 119.526 8 256.187 8.101 393.068 119.096 504 256 504c63.926 0 122.202-24.187 166.178-63.908 5.113-4.618 5.354-12.561.482-17.433l-33.971-33.971c-4.466-4.466-11.64-4.717-16.38-.543C341.308 415.448 300.606 432 256 432c-97.267 0-176-78.716-176-176 0-97.267 78.716-176 176-176 60.892 0 114.506 30.858 146.099 77.8l-101.525-4.865c-6.845-.328-12.574 5.133-12.574 11.986v47.411c0 6.627 5.373 12 12 12h200.333c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12z" fill="rgb(30, 179, 188)"/></svg>
        </ReloadButton>
        <Container>
          <Table>
            <thead>
              <tr>
                <th>TIME</th>
                <th>EMAIL</th>
                <th>EMAIL STATUS</th>
                <th>PICTURES</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {this.state.collections.map((collection, idx) => {
                const countStared = collection.pictures.filter((p) => p.stared).length;
                return (
                  <tr className={idx % 2 === 0 ? 'alternate' : ''} key={idx} title={collection._id}>
                    <td>{format(collection.createdAt, 'HH:mm DD-MM')}</td>
                    <td>{collection.email || '--'}</td>
                    <td style={{ textAlign: 'center' }}>{emailStatus[collection.emailSent] || '-'}</td>
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
      </Modal>
    );
  }
}

EmailStatusTable.propTypes = {};

export default EmailStatusTable;
