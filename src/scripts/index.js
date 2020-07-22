import 'regenerator-runtime/runtime';
import Photos from './photos';

let photos = null;

window.addEventListener('resize', () => {
  photos.resize();
});

window.addEventListener('load', () => {
  photos = new Photos(document.querySelector('canvas.pics'));
});
