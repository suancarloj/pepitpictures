export default function countPictures() {
  return (pictures) => {
    let count = 0;

    pictures.pictures.forEach((p) => {
      if (p.stared) {
        count += 1;
      }
    });

    return count;
  };
}
