import matchHelper from 'posthtml-match-helper';
import idPluginCheck from './idPluginCheck.mjs';
import useSVG from './useSVG.mjs';

export default function ToCPlugin(conf, opts = {}) {
  const idAttrPlugin = idPluginCheck(conf);
  const defaultOpts = {
    backToTopIcon: useSVG('doubleChevUp'),
    backToTopLabel: 'Back to Top',
    insertBackToTopAfter: undefined,
    label: 'Table of Contents',
    scrollSelector: undefined,
    title: 'Go back to the table of contents',
  };
  let pluginOpts = { ...defaultOpts, ...opts };
  
  conf.addShortcode('ToC', async function (userOpts = {}) {
    pluginOpts = { ...pluginOpts, ...userOpts };
    
    await conf.pluginDeps.addCSS('plugin-toc.css', this.page);
    await conf.pluginDeps.addJS('plugin-toc.js', this.page);
    await conf.pluginDeps.addSVG([
      {
        id: 'circle',
        viewBox: '0 0 24 24',
        content: '<circle cx="50%" cy="50%" r="12" fill="currentColor"/>',
      },
      {
        id: 'doubleChevUp',
        viewBox: '-0.5 0 15 15',
        content: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M1.70711 14.7071C1.31658 15.0976 0.68342 15.0976 0.29289 14.7071C-0.09763 14.3166 -0.09763 13.6834 0.29289 13.2929L6.2929 7.2929C6.6834 6.9024 7.3166 6.9024 7.7071 7.2929L13.7071 13.2929C14.0976 13.6834 14.0976 14.3166 13.7071 14.7071C13.3166 15.0976 12.6834 15.0976 12.2929 14.7071L7 9.4142L1.70711 14.7071zM1.70711 7.7071C1.31658 8.0976 0.68342 8.0976 0.29289 7.7071C-0.09763 7.3166 -0.09763 6.6834 0.29289 6.2929L6.2929 0.29289C6.6834 -0.09763 7.3166 -0.09763 7.7071 0.29289L13.7071 6.2929C14.0976 6.6834 14.0976 7.3166 13.7071 7.7071C13.3166 8.0976 12.6834 8.0976 12.2929 7.7071L7 2.41421L1.70711 7.7071z"></path>',
      },
    ], this.page);
    
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
              useSVG('circle'),
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
              const sSData = (pluginOpts.scrollSelector)
                ? ` data-scroll-selector="${pluginOpts.scrollSelector}"`
                : '';
              const title = (pluginOpts.title)
                ? ` title="${pluginOpts.title}"`
                : '';
              added = true;
              
              return {
                tag: false,
                content: [
                  node,
                  `<div class="toc-b2t"><a class="toc-b2t__link is--hidden" href="#toc-top"${title}${sSData}>${pluginOpts.backToTopIcon}${pluginOpts.backToTopLabel}</a></div>`
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
