const MODIFIER__HIDDEN = 'is--hidden';
const MODIFIER__VISIBLE = 'is--visible';
const btn = document.querySelector('.toc-b2t__link');
const offset = getComputedStyle(btn).getPropertyValue('top').replace('px', '');

btn.classList.remove(MODIFIER__HIDDEN);

let scrollDebounce;
addEventListener('scroll', (ev) => {
  if (scrollDebounce) clearTimeout(scrollDebounce);
  
  scrollDebounce = setTimeout(() => {
    if (window.scrollY > offset) {
      btn.classList.add(MODIFIER__VISIBLE);
    }
    else {
      btn.classList.remove(MODIFIER__VISIBLE);
    }
  }, 100);
});
