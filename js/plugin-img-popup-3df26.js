const EV_CLOSED=window.CustomDialog.events.closed,ID__IMG="imgPopupImg",ID__POPUP="imgPopup",MODIFIER__CONTAINED="is--contained",MODIFIER__LOADING="is--loading",MODIFIER__ZOOMABLE="is--zoomable",ROOT_CLASS="img-popup-dialog",SELECTOR__PLUGIN="img-popup",SELECTOR__COUNTER=`${ROOT_CLASS}__counter`,SELECTOR__IMGS=`${ROOT_CLASS}__imgs`,TRANSP_IMG="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",els={};let imgNdx=0;function addDialog(){document.body.insertAdjacentHTML("beforeend",`
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
      </custom-dialog>
    </div>
  `),els.popup=document.getElementById(ID__POPUP),els.img=document.getElementById(ID__IMG),els.imgs=els.popup.querySelector(`.${SELECTOR__IMGS}`),els.prevImgBtn=els.popup.querySelector("nav button:first-of-type"),els.nextImgBtn=els.popup.querySelector("nav button:last-of-type"),els.counter=els.popup.querySelector(`.${SELECTOR__COUNTER}`),window.addEventListener(EV_CLOSED,handleDialogClosed,{once:!0})}let loading=!1,loadingTimeout;function addLoadingState(){loading=!0,clearTimeout(loadingTimeout),loadingTimeout=setTimeout(()=>{els.imgs.classList.add(MODIFIER__LOADING),els.prevImgBtn.disabled=!0,els.nextImgBtn.disabled=!0},100)}function checkIfImageCached(e){const t=document.createElement("img");return t.src=e,t.complete}let imgSizeDebounce;function checkImgSize(e){const t=e?100:0;clearTimeout(imgSizeDebounce),imgSizeDebounce=setTimeout(()=>{els.img.naturalWidth>els.img.width||els.img.naturalHeight>els.img.height?els.img.classList.add(MODIFIER__ZOOMABLE):els.img.classList.contains(MODIFIER__CONTAINED)?els.img.classList.remove(MODIFIER__ZOOMABLE):els.img.naturalWidth===els.imgs.offsetWidth&&els.img.naturalHeight===els.imgs.offsetHeight&&(els.img.classList.add(MODIFIER__CONTAINED),els.img.classList.remove(MODIFIER__ZOOMABLE))},t)}function handleDialogClosed(){window.removeEventListener("keyup",handleKeyboardNavigation),window.removeEventListener("resize",checkImgSize),els.popup.remove()}function handleKeyboardNavigation({key:e}){switch(e){case"ArrowLeft":showPrevImg();break;case"ArrowRight":showNextImg();break}}function handleLoadedImage(e){removeLoadingState(),e.src=e.dataset.src,e.classList.add(MODIFIER__CONTAINED),checkImgSize()}function loadImage(e,t){addLoadingState();const n=new Image;n.addEventListener("load",t,{once:!0}),n.src=e}function preloadImg(){const{src:e}=els.img.dataset;checkIfImageCached(e)?handleLoadedImage(els.img):loadImage(e,handleLoadedImage.bind(null,els.img))}function removeLoadingState(){clearTimeout(loadingTimeout),els.imgs.classList.remove(MODIFIER__LOADING),els.prevImgBtn.disabled=!1,els.nextImgBtn.disabled=!1,loading=!1}function updateCounter(){const e=els.popupThumbs.length,t=(""+e).length;els.counter.textContent=`${(""+(imgNdx+1)).padStart(t,"0")} / ${e}`}function setImgSrc(){els.img.dataset.src=els.popupThumbs[imgNdx].href}function setUpImgZoom(){els.img.addEventListener("pointerup",()=>{els.img.classList.contains(MODIFIER__ZOOMABLE)&&els.img.classList.toggle(MODIFIER__CONTAINED)})}function setUpNav(){els.prevImgBtn.addEventListener("click",showPrevImg),els.nextImgBtn.addEventListener("click",showNextImg),window.addEventListener("keyup",handleKeyboardNavigation),updateCounter()}function showNextImg(){loading||(imgNdx+=1,imgNdx===els.popupThumbs.length&&(imgNdx=0),setImgSrc(),preloadImg(),updateCounter())}function showPrevImg(){loading||(imgNdx-=1,imgNdx<0&&(imgNdx=els.popupThumbs.length-1),setImgSrc(),preloadImg(),updateCounter())}function watchViewportSize(){window.addEventListener("resize",checkImgSize)}document.addEventListener("click",e=>{const t=e.target;t.classList.contains(SELECTOR__PLUGIN)&&(e.preventDefault(),imgNdx=els.popupThumbs.findIndex(({href:n})=>n===t.href),addDialog(),setImgSrc(),preloadImg(),setUpImgZoom(),setUpNav(),watchViewportSize())}),[...document.querySelectorAll(".img-popup")].forEach(e=>{e.classList.remove("is--inactive"),els.popupThumbs||(els.popupThumbs=[]),els.popupThumbs.push(e)});
