import matchHelper from 'posthtml-match-helper';
import idPluginCheck from './idPluginCheck.mjs';
import useSVG from './useSVG.mjs';

export default function HeadingLinkPlugin(conf, opts = {}) {
  const idAttrPlugin = idPluginCheck(conf);
  const defaultOpts = {};
  let pluginOpts = { ...defaultOpts, ...opts };
  
  conf.addPreprocessor('hl-heading-check', '*', async function (data, content) {
    // for now only checking against md files
    if (data.page.templateSyntax.includes('md')) {
      if ( /^#{1,6} \w+/gm.test(content) ) {
        await conf.pluginDeps.addCSS('plugin-hl.css', data.page);
        await conf.pluginDeps.addSVG({
          id: 'hlink',
          viewBox: '0 0 16 16',
          content: '<path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path>',
        }, data.page);
      }
    }
	});
  
  conf.htmlTransformer.addPosthtmlPlugin(
    'html',
    function HeadingLinkPostHTMLPlugin() {
      return (tree) => {
        tree.match(matchHelper(idAttrPlugin.options.selector.replace('[id],', '')), (node) => {
          return (/h[1-6]/.test(node.tag) && !node.updated)
            ? {
              tag: 'div',
              attrs: { class: 'h-link' },
              content: [
                {
                  tag: node.tag,
                  attrs: { ...node.attrs, tabindex: -1 },
                  content: node.content,
                  updated: true,
                },
                {
                  tag: 'a',
                  attrs: { href: `#${node.attrs.id}` },
                  content: [useSVG('hlink')],
                }
              ],
            }
            : node;
        });
      };
    },
    {},
  );
}
