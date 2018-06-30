import Config from '../../angular/common/ConfigProvider';

export function setPicturesEmail(pictureSetId, email) {
  const options = {
    method: 'put',
    body: JSON.stringify({ email }),
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${Config.apiBasePath}pictures/${pictureSetId}/set-email`;
  return fetch(path, options).then(res => res.json());
}

export function publishPictures(pictureSetId) {
  const options = {
    method: 'put',
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${Config.apiBasePath}pictures/${pictureSetId}/publish`;
  return fetch(path, options).then(res => res.json());
}

export default {};
