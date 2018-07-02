import React, { Component } from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import styled from 'styled-components';
import { basePath, getPicturesForComputer, publishPictures } from '../services/pictures';

const Container = styled.div`
  overflow-y: auto;
`;

const List = styled.ul`
  padding: 0;
  list-style-type: none;
  li {
    border-bottom: 1px solid rgba(204, 204, 204, 0.3);
    padding: 6px 0;
    &.alternate {
      background-color: rgb(114, 30, 188, 0.05);
    }
  }
`;

const Email = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 12px;
`;

const Metadata = styled.div`
  font-family: Roboto, sans-serif;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.3);
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

const Link = Button.withComponent('a');

class PictureList extends Component {
  static propTypes = {
    computerId: PropTypes.string.isRequired,
    pictureSetId: PropTypes.string.isRequired,
    publish: PropTypes.func.isRequired,
  }

  state = {
    pictureCollection: [],
  }

  componentDidMount() {
    this.getLastTenPictureSet();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.pictureSetId !== prevProps.pictureSetId) {
      this.getLastTenPictureSet();
    }
  }

  getLastTenPictureSet = () => {
    getPicturesForComputer(this.props.computerId)
      .then(pictureCollection => {
        this.setState({ pictureCollection: pictureCollection.docs })
      })
  }

  render() {
    return (
      <Container>
        <List>
          {this.state.pictureCollection.map((collection, idx) => {
            const starredCount = collection.pictures.filter((p) => p.starred).length;
            const date = format(collection.createdAt, 'HH:mm DD-MM');
            return (
              <li className={idx % 2 === 0 ? 'alternate' : ''} key={idx}>
                <div>
                  <Email>{collection.email}</Email>
                  <Metadata>
                    {date}  {`(${starredCount} / ${collection.pictures.length})`}
                  </Metadata>
                  <Link
                    href={`${basePath}/pictures/${collection._id}/download`}
                    download
                  >
                    Download
                  </Link>
                  <Button onClick={() => publishPictures(collection._id)}>
                    Send email
                  </Button>
                </div>
              </li>
            );
          })}
        </List>
      </Container>
    );
  }
}

PictureList.propTypes = {};

export default PictureList;
