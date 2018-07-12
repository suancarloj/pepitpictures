// const basePath = 'http://192.168.0.130:9000';
export const basePath = 'http://localhost:9000';


const statusHandler = (response) => {
  if (response.status >= 400 && response.status < 600) {
    throw new Error("Bad response from server");
  }
  return response.json();
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
  return fetch(path, options).then(statusHandler);
}

export function publishPictures(pictureSetId) {
  const options = {
    method: 'put',
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${basePath}/pictures/${pictureSetId}/publish`;
  return fetch(path, options).then(statusHandler);
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
  return fetch(path, options).then(statusHandler);
}

export function getPictures(computerId, limit) {
  const options = {
    method: 'get',
    headers: {
      'content-type': 'application/json',
    },
  };

  const query = {};
  if (computerId) {
    query.computer = `computer-${computerId}`;
  }

  if (limit) {
    query.limit = limit;
  }

  const queryStr = Object.keys(query)
    .map(k => `${k}=${query[k]}`)
    .join('&')

  const path = `${basePath}/pictures?${queryStr}`;
  return fetch(path, options).then(statusHandler);
}

export function createNewPictureCollection(computerId) {
  const options = {
    method: 'post',
    body: JSON.stringify({ computerId: `computer-${computerId}` }),
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${basePath}/pictures`;
  return fetch(path, options).then(statusHandler);
}

export function uploadPicture(file, computerId, pictureSetId) {
  const formData = new FormData();
  formData.set('img', file);
  const options = {
    method: 'post',
    body: formData,
  };
  const path = `${basePath}/upload/computer-${computerId}?set=${pictureSetId}`;
  return fetch(path, options).then(statusHandler);
}
