const ObjectId = require('mongoose').Types.ObjectId;
const PictureSet = require('../stores/picture-set.store');

exports.updateEmail = function updateEmail(pictureSetId, email) {
  if (!pictureSetId) {
    throw new Error('Erreur lors de la création d’un set, paramètre manquant dans l’url');
  }

  const search = { _id: new ObjectId(pictureSetId) };
  const update = { email: email };

  return PictureSet.update(search, update).then((set) => ({ status: 'success', data: set }));
}
