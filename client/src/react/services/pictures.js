import Config from '../../angular/common/ConfigProvider';

export function setPicturesEmail(pictureSetId, email) {
  const options = {
    method: 'put',
    body: JSON.stringify({ email }),
    headers: {
      'content-type': 'application/json',
    },
  };
  const path = `${Config.apiBasePath}picture-set/${pictureSetId}/set-email`;
  return fetch(path, options).then(res => res.json());
}

export default {};
