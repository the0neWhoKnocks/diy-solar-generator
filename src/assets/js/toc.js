const MODIFIER__HIDDEN = 'is--hidden';
const MODIFIER__VISIBLE = 'is--visible';
const btn = document.querySelector('.toc-b2t__link');
const offset = getComputedStyle(btn).getPropertyValue('top').replace('px', '');
const { scrollSelector } = btn.dataset;
const scrollEl = (scrollSelector) ? document.querySelector(scrollSelector) : window;

if (scrollEl) {
  btn.classList.remove(MODIFIER__HIDDEN);
  
  const scrollPos = (scrollEl === window) ? 'scrollY' : 'scrollTop';
  let scrollDebounce;
  
  scrollEl.addEventListener('scroll', (ev) => {
    if (scrollDebounce) clearTimeout(scrollDebounce);
    
    scrollDebounce = setTimeout(() => {
      if (scrollEl[scrollPos] > offset) {
        btn.classList.add(MODIFIER__VISIBLE);
      }
      else {
        btn.classList.remove(MODIFIER__VISIBLE);
      }
    }, 100);
  });
}
else {
  console.warn(`No element found with selector \`${scrollSelector}\``);
}
