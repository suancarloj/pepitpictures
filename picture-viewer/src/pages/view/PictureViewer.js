import React from 'react';

export function PictureViewer(props) {
  return (
    <main>
      <i className="large mdi-image-navigation-arrow-back" />
      {props.imgSrc && <img src={`http://localhost:3333/uploads/${props.imgSrc}`} alt="" />}
    </main>
  );
}
