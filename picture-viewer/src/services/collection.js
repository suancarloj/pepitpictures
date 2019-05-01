export const basePath = 'http://192.168.0.131:9000';
// export const basePath = 'http://localhost:3333';

const statusHandler = (response) => {
  if (response.status >= 400 && response.status < 600) {
    throw new Error('Bad response from server');
  }
  return response.json();
};

export function getAllPictures() {
  const options = {
    method: 'get',
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${basePath}/pictures/computer-${window.location.pathname.match(/\d/g).pop()}`;
  return fetch(path, options).then(statusHandler);
}

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

export function starPicture({ setId, pictureId, stared }) {
  const options = {
    method: 'put',
    body: JSON.stringify({}),
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${basePath}/pictures/${setId}/${pictureId}?stared=${stared}`;
  return fetch(path, options).then(statusHandler);
}
