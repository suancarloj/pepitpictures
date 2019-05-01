import React from 'react';
import { basePath } from '../../services/collection';

export function PictureViewer(props) {
  return (
    <main>
      {props.children}
      <i className="large mdi-image-navigation-arrow-back" />
      {props.imgSrc && <img src={`${basePath}/uploads/${props.imgSrc}`} alt="" />}
    </main>
  );
}
