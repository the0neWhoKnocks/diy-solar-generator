import matchHelper from 'posthtml-match-helper';

export default function ToCPlugin(conf, opts = {}) {
  const idAttrPluginName = 'IdAttributePlugin';
  const idAttrPlugin = conf.plugins.find(({ plugin }) => plugin.name === idAttrPluginName);
  let err;
  if (!idAttrPlugin) err = `The '${idAttrPluginName}' plugin was not found, can't build a ToC without it.`;
  else if (!idAttrPlugin?.options?.selector) err = `The '${idAttrPluginName}' plugin has no 'selector' options, can't build a ToC without it.`;
  else if (!idAttrPlugin.options.selector.startsWith('[id],')) err = `The '${idAttrPluginName}' plugin has no 'selector' options, can't build a ToC without it.`;
  
  if (err) throw Error(err);
  
  const defaultOpts = {
    backToTopIcon: '▲ ',
    backToTopLabel: 'Back to Top',
    insertBackToTopAfter: undefined,
    label: 'Table of Contents',
  };
  let pluginOpts = { ...defaultOpts, ...opts };
  
  conf.addShortcode('ToC', (userOpts = {}) => {
    pluginOpts = { ...pluginOpts, ...userOpts };
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
        
        tree.match(matchHelper(idAttrPlugin.options.selector), (node) => {
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
