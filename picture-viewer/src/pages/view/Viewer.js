import React, { useEffect, useState } from 'react';

import { PictureViewer } from './PictureViewer';
import { Navbar } from './Navbar';
import Email from './Email';
import Socket from '../../components/Socket';
import { basePath, getAllPictures, starPicture } from '../../services/collection';

export function Viewer(props) {
  const [pictureSetId, setPictureSetId] = useState(null);
  const [pictureCollection, setPictureCollection] = useState({ pictures: [] });
  const [showStared, setShowStared] = useState(false);
  const [currentPicture, setCurrentPicture] = useState(0);
  const staredCollection = pictureCollection.pictures.filter((p) => p.stared);
  const collection = showStared ? staredCollection : pictureCollection.pictures;

  function updateCollection() {
    getAllPictures().then((res) => {
      setPictureCollection(res.data);
      setPictureSetId(res.data._id);
    });
  }
  useEffect(() => {
    updateCollection();
  }, []);

  function next() {
    setCurrentPicture((currentPicture + 1) % collection.length);
  }

  function prev() {
    setCurrentPicture((currentPicture === 0 && collection.length - 1) || currentPicture - 1);
  }

  const picture = collection[currentPicture];

  return (
    <>
      <Socket
        host={`${basePath}?room=computer-${props.computerId}`}
        registerId={props.computerId}
        subscribeTopic="fetch-fresh-data"
        subscribeCallback={(topic, data) => updateCollection()}
      >
        {() => (
          <>
            <PictureViewer imgSrc={picture && picture.name}>
              <Email computerId={props.computerId} pictureSetId={pictureSetId} />
            </PictureViewer>
            <Navbar
              next={next}
              pictureCount={pictureCollection.pictures.length}
              prev={prev}
              showStared={showStared}
              stared={picture && picture.stared}
              staredCount={staredCollection.filter((p) => p.stared).length}
              toggleStarPicture={() => {
                starPicture({
                  setId: pictureSetId,
                  pictureId: picture._id,
                  stared: !picture.stared,
                })
                  .then(() => {
                    if (picture.stared) {
                      const nextPictureIndex = currentPicture - 1;
                      if (nextPictureIndex > 0) {
                        setCurrentPicture(nextPictureIndex);
                      } else if (nextPictureIndex === 0) {
                        setCurrentPicture(0);
                      } else {
                        setShowStared(false);
                      }
                    }
                  })
                  .then(updateCollection)
                  .catch((err) => console.error(err));
              }}
              toggleShowStared={() => {
                setCurrentPicture(0);
                setShowStared(!showStared);
              }}
            />
          </>
        )}
      </Socket>
    </>
  );
}
