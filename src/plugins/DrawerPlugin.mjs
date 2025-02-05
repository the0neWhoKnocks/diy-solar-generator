import useSVG from "./useSVG.mjs";

export default function DrawerPlugin(conf, opts = {}) {
  const defaultOpts = {};
  let pluginOpts = { ...defaultOpts, ...opts };
  
  conf.addPairedShortcode('drawer', async function(content, label, open = false) {
    await conf.pluginDeps.addCSS('plugin-drawer.css', this.page);
    await conf.pluginDeps.addSVG([
      {
        id: 'expandLess',
        viewBox: '0 0 24 24',
        content: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.293 7.293a1 1 0 0 1 1.414 0l8 8a1 1 0 0 1-1.414 1.414L12 9.414l-7.293 7.293a1 1 0 0 1-1.414-1.414l8-8Z"></path>',
      },
      {
        id: 'expandMore',
        viewBox: '0 0 24 24',
        content: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M3.293 7.293a1 1 0 0 1 1.414 0L12 14.586l7.293-7.293a1 1 0 1 1 1.414 1.414l-8 8a1 1 0 0 1-1.414 0l-8-8a1 1 0 0 1 0-1.414Z"></path>',
      },
    ], this.page);
    
    return [
      `<details class="drawer"${open ? ' open' : ''}>`,
        '<summary class="drawer__title" title="Click to toggle">',
          `<span class="drawer__title-txt">${label}</span>`,
          '<div class="drawer__title-icon">',
            useSVG('expandLess', 'for--less'),
            useSVG('expandMore', 'for--more'),
          '</div>',
        '</summary>',
        `<div class="drawer__content">${content}</div>`,
      '</details>',
    ].join('');
  });
}
