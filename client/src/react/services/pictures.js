// const basePath = 'http://192.168.0.130:9000';
const basePath = 'http://localhost:9000';

export function setPicturesEmail(pictureSetId, email) {
  const options = {
    method: 'put',
    body: JSON.stringify({ email }),
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${basePath}/pictures/${pictureSetId}/set-email`;
  return fetch(path, options).then(res => res.json());
}

export function publishPictures(pictureSetId) {
  const options = {
    method: 'put',
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${basePath}/pictures/${pictureSetId}/publish`;
  return fetch(path, options).then(res => res.json());
}

export function createPictureCollection(computerId) {
  const options = {
    method: 'post',
    body: JSON.stringify({ computerId: `computer-${computerId}` }),
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${basePath}/pictures`;
  return fetch(path, options).then(res => res.json());
}

export function getPicturesForComputer(computerId) {
  const options = {
    method: 'post',
    body: JSON.stringify({ computerId: `computer-${computerId}` }),
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${basePath}/pictures/computer/computer-${computerId}`;
  return fetch(path, options).then(res => res.json());
}

export function uploadPicture(file, computerId, pictureSetId) {
  const formData = new FormData();
  formData.set('img', file);
  const options = {
    method: 'post',
    body: formData,
  };
  const path = `${basePath}/upload/computer-${computerId}?set=${pictureSetId}`;
  return fetch(path, options).then(res => res.json());
}
