export default function ImgPopupPlugin(conf, opts = {}) {
  const defaultOpts = {};
  let pluginOpts = { ...defaultOpts, ...opts };
  
  conf.addShortcode('imgPopUp', async function(lrgURL, alt) {
    const mani = this.ctx?.environments?.manifest;
    
    if (mani) {
      await conf.pluginDeps.addCSS('img-popup.css', this.page);
      await conf.pluginDeps.addJS([
        'CustomDialog.js',
        'img-popup.js',
      ], this.page);
      
      const parseURL = (url) => (url.startsWith('mani:'))
        ? mani[url.replace(/^mani:/, '')]
        : url;
      const altAttr = (alt) ? ` alt="${alt}"` : '';
      const ext = '.jpg';
      
      return [
        `<a class="img-popup is--inactive" href="${parseURL(`${lrgURL}${ext}`)}" target="_blank">`,
        `  <img src="${parseURL(`${lrgURL}-thumb${ext}`)}"${altAttr} loading="lazy" />`,
        '</a>',
      ].join('');
    }
    
    return '<span>[ERROR: Missing manifest]</span>';
  });
}
