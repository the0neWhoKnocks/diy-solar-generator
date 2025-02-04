import matchHelper from 'posthtml-match-helper';
import idPluginCheck from './idPluginCheck.mjs';

export default function ToCPlugin(conf, opts = {}) {
  const idAttrPlugin = idPluginCheck(conf);
  const defaultOpts = {
    backToTopIcon: '▲ ',
    backToTopLabel: 'Back to Top',
    insertBackToTopAfter: undefined,
    label: 'Table of Contents',
  };
  let pluginOpts = { ...defaultOpts, ...opts };
  
  conf.addShortcode('ToC', async function (userOpts = {}) {
    pluginOpts = { ...pluginOpts, ...userOpts };
    
    await conf.pluginDeps.addCSS('toc.css', this.page);
    await conf.pluginDeps.addJS('toc.js', this.page);
    
    return `<toc></toc>`;
  });
  
  conf.htmlTransformer.addPosthtmlPlugin(
    'html',
    function ToCPostHTMLPlugin() {
      const rootNdx = +idAttrPlugin.options.selector.match(/\[id\],h([1-6])/)[1];
      const rootList = [];
      const toc = {
        tag: 'nav',
        attrs: { class: 'toc' },
        content: [{ tag: 'ul', content: rootList }],
      };
      
      if (pluginOpts.label) toc.content.unshift(`<div class="toc__label">${pluginOpts.label}</div>`);
      toc.content.unshift('<a id="toc-top"></a>');
      
      return (tree) => {
        let listRef = { [rootNdx]: rootList };
        let currList;
        let prevNdx;
        
        if (!tree.source.includes('<toc>')) return;
        
        tree.match(matchHelper(idAttrPlugin.options.selector.replace('[id],', '')), (node) => {
          const hNdx = +node.tag.substring(1);
          
          if (hNdx === rootNdx) {
            currList = listRef[rootNdx];
          }
          else if (hNdx > prevNdx) {
            const newList = [];
            listRef[hNdx] = newList;
            currList[currList.length - 1].content.push({
              tag: 'ul',
              content: newList,
            });
            currList = newList;
          }
          else if (hNdx < prevNdx) {
            if (listRef[hNdx]) currList = listRef[hNdx];
            else {
              // User could have invalid nesting like:
              // ```
              // - h1
              //   - h6
              //   - h3
              // ```
              // so account for that edge case. 
              throw Error(`Improper heading nesting level detected for: ${node.tag} | text: "${node.content[0]}". You should check the heading before this one and ensure that it's nesting isn't lower.`);
            }
          }
          
          currList.push({
            tag: 'li',
            content: [
              {
                tag: 'a',
                attrs: { href: `#${node.attrs.id}` },
                content: [node.content[0]],
              }
            ],
          });
          
          prevNdx = hNdx;
          
          return node;
        });
        
        tree.match(matchHelper('toc'), () => toc);
        
        if (pluginOpts.insertBackToTopAfter) {
          let added = false;
          tree.match(matchHelper(pluginOpts.insertBackToTopAfter), (node) => {
            if (!added) {
              added = true;
              return {
                tag: false,
                content: [
                  node,
                  `<div class="toc-b2t"><a class="toc-b2t__link is--hidden" href="#toc-top">${pluginOpts.backToTopIcon}${pluginOpts.backToTopLabel}</a></div>`
                ],
              };
            }
            
            return node;
          });
        }
      };
    },
    {},
  );
}
