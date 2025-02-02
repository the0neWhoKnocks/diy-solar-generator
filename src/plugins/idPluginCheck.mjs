export default function idPluginCheck(conf) {
  const idAttrPluginName = 'IdAttributePlugin';
  const idAttrPlugin = conf.plugins.find(({ plugin }) => plugin.name === idAttrPluginName);
  let err;
  if (!idAttrPlugin) err = `The '${idAttrPluginName}' plugin was not found, can't build a ToC without it.`;
  else if (!idAttrPlugin?.options?.selector) err = `The '${idAttrPluginName}' plugin has no 'selector' options, can't build a ToC without it.`;
  else if (!idAttrPlugin.options.selector.startsWith('[id],')) err = `The '${idAttrPluginName}' plugin has no 'selector' options, can't build a ToC without it.`;
  
  if (err) throw Error(err);
  
  return idAttrPlugin;
}
