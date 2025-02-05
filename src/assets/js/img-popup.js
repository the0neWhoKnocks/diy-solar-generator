const EV_CLOSED = window.CustomDialog.events.closed;
const ID__IMG = 'imgPopupImg';
const ID__POPUP = 'imgPopup';
const MODIFIER__CONTAINED = 'is--contained';
const MODIFIER__LOADING = 'is--loading';
const ROOT_CLASS = 'img-popup-dialog';
const SELECTOR__PLUGIN = 'img-popup';
const SELECTOR__COUNTER = `${ROOT_CLASS}__counter`;
const SELECTOR__IMGS = `${ROOT_CLASS}__imgs`;
const TRANSP_IMG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const els = {};
let imgNdx = 0;

function addDialog() {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="${ROOT_CLASS}" id="${ID__POPUP}">
      <custom-dialog open>
        <div class="${ROOT_CLASS}__body" slot="dialogBody">
          <div class="${SELECTOR__IMGS}">
            <img id="${ID__IMG}" class="${MODIFIER__CONTAINED}" src="${TRANSP_IMG}"></img>
            <div class="${ROOT_CLASS}__loading-indicator">
              <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8"></circle>
                <path stroke-linecap="round" fill="none" d="M02,10 C02,5.5 5.5,02 10,02"></path>
              </svg>
            </div>
            <nav>
              <button type="button" disabled>
                <svg viewBox="0 0 100 50">
                  <polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" points="15, 15 50, 50 85, 15"></polyline>
                </svg>
              </button>
              <button type="button" disabled>
                <svg viewBox="0 0 100 50">
                  <polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" points="15, 15 50, 50 85, 15"></polyline>
                </svg>
              </button>
            </nav>
            <div class="${SELECTOR__COUNTER}"></div>
          </div>
        </div>
      </custom-dialog>
    </div>
  `);
  
  els.popup = document.getElementById(ID__POPUP);
  els.img = document.getElementById(ID__IMG);
  els.imgs = els.popup.querySelector(`.${SELECTOR__IMGS}`);
  els.prevImgBtn = els.popup.querySelector('nav button:first-of-type');
  els.nextImgBtn = els.popup.querySelector('nav button:last-of-type');
  els.counter = els.popup.querySelector(`.${SELECTOR__COUNTER}`);
  
  window.addEventListener(EV_CLOSED, handleDialogClosed, { once: true });
}

let loading = false;
let loadingTimeout;
function addLoadingState() {
  loading = true;
  
  // Add the loading state if it's taking longer than X.
  clearTimeout(loadingTimeout);
  loadingTimeout = setTimeout(() => {
    els.imgs.classList.add(MODIFIER__LOADING);
    els.prevImgBtn.disabled = true;
    els.nextImgBtn.disabled = true;
  }, 100);
}

function checkIfImageCached(imgPath) {
  const img = document.createElement('img');
  img.src = imgPath;

  return img.complete;
}

function handleDialogClosed() {
  window.removeEventListener('keyup', handleKeyboardNavigation);
  els.popup.remove();
}

function handleKeyboardNavigation({ key }) {
  switch (key) {
    case 'ArrowLeft': showPrevImg(); break;
    case 'ArrowRight': showNextImg(); break;
  }
}

function handleLoadedImage(img) {
  removeLoadingState();
  img.src = img.dataset.src;
}

function loadImage(imgPath, cb) {
  addLoadingState();
  
  const img = new Image();
  img.addEventListener('load', cb, { once: true });
  img.src = imgPath;
}

function preloadImg() {
  const { src } = els.img.dataset;
  
  (checkIfImageCached(src))
    ? handleLoadedImage(els.img)
    : loadImage(src, handleLoadedImage.bind(null, els.img));
}

function removeLoadingState() {
  clearTimeout(loadingTimeout);
  els.imgs.classList.remove(MODIFIER__LOADING);
  els.prevImgBtn.disabled = false;
  els.nextImgBtn.disabled = false;
  loading = false;
}

function updateCounter() {
  const imgCount = els.popupThumbs.length;
  const imgCountLength = (''+imgCount).length;
  
  els.counter.textContent = `${(''+(imgNdx + 1)).padStart(imgCountLength, '0')} / ${imgCount}`;
}

function setImgSrc() {
  els.img.dataset.src = els.popupThumbs[imgNdx].href;
}

function setUpImgZoom() {
  els.img.addEventListener('pointerup', () => {
    els.img.classList.toggle(MODIFIER__CONTAINED);
  });
}

function setUpNav() {
  els.prevImgBtn.addEventListener('click', showPrevImg);
  els.nextImgBtn.addEventListener('click', showNextImg);
  window.addEventListener('keyup', handleKeyboardNavigation);
  
  updateCounter();
}

function showNextImg() {
  if (!loading) {
    imgNdx += 1;
    if (imgNdx === els.popupThumbs.length) imgNdx = 0;
    setImgSrc();
    preloadImg();
    updateCounter();
  }
}

function showPrevImg() {
  if (!loading) {
    imgNdx -= 1;
    if (imgNdx < 0) imgNdx = els.popupThumbs.length - 1;
    setImgSrc();
    preloadImg();
    updateCounter();
  }
}

document.addEventListener('click', (ev) => {
  const el = ev.target;
  
  if (el.classList.contains(SELECTOR__PLUGIN)) {
    ev.preventDefault();
    
    imgNdx = els.popupThumbs.findIndex(({ href }) => href === el.href);
    
    addDialog();
    setImgSrc();
    preloadImg();
    setUpImgZoom();
    setUpNav();
  }
});

[...document.querySelectorAll('.img-popup')].forEach((el) => {
  el.classList.remove('is--inactive');
  
  if (!els.popupThumbs) els.popupThumbs = [];
  els.popupThumbs.push(el); 
});
