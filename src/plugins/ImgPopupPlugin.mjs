import useSVG from "./useSVG.mjs";

export default function ImgPopupPlugin(conf, opts = {}) {
  const defaultOpts = {};
  let pluginOpts = { ...defaultOpts, ...opts };
  
  conf.addShortcode('imgPopUp', async function(lrgURL, alt) {
    const mani = this.ctx?.environments?.manifest;
    
    if (mani) {
      await conf.pluginDeps.addCSS('plugin-img-popup.css', this.page);
      await conf.pluginDeps.addJS([
        'CustomDialog.js',
        'plugin-img-popup.js',
      ], this.page);
      await conf.pluginDeps.addSVG({
        id: 'expand',
        viewBox: '0 0 24 24',
        content: '<path stroke-linecap="round" stroke-linejoin="round" d="M16 8L21 3M21 3H16M21 3V8M8 8L3 3M3 3L3 8M3 3L8 3M8 16L3 21M3 21H8M3 21L3 16M16 16L21 21M21 21V16M21 21H16"></path>',
      }, this.page);
      
      // <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">  </g></svg>
      
      const parseURL = (url) => (url.startsWith('mani:'))
        ? mani[url.replace(/^mani:/, '')]
        : url;
      const altAttr = (alt) ? ` alt="${alt}"` : '';
      const ext = '.jpg';
      
      return [
        `<a class="img-popup is--inactive" href="${parseURL(`${lrgURL}${ext}`)}" target="_blank">`,
        `  <img src="${parseURL(`${lrgURL}-thumb${ext}`)}"${altAttr} loading="lazy" />`,
        `  ${useSVG('expand')}`,
        '</a>',
      ].join('');
    }
    
    return '<span>[ERROR: Missing manifest]</span>';
  });
}
