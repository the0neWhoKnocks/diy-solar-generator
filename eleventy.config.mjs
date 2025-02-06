import { createHash } from 'node:crypto';
import { constants as fsC } from 'node:fs';
import { access, readFile, stat, writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { EleventyHtmlBasePlugin, IdAttributePlugin } from '@11ty/eleventy';
import NavigationPlugin from '@11ty/eleventy-navigation';
import InclusiveLangPlugin from '@11ty/eleventy-plugin-inclusive-language';
import SyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import CleanCSS from 'clean-css';
import CleanPlugin from 'eleventy-plugin-clean';
import * as esbuild from 'esbuild';
import { glob } from 'glob';
import htmlMin from 'html-minifier-terser';
import markdownIt from 'markdown-it';
import markdownItDecorate from 'markdown-it-decorate';
import { container as markdownItContainer } from '@mdit/plugin-container';
import { mkdirp } from 'mkdirp';
import { rimraf } from 'rimraf';
import sharp from 'sharp';
import DrawerPlugin from './src/plugins/DrawerPlugin.mjs';
import HeadingLinkPlugin from './src/plugins/HeadingLinkPlugin.mjs';
import ImgPopupPlugin from './src/plugins/ImgPopupPlugin.mjs';
import ToCPlugin from './src/plugins/ToCPlugin.mjs';


const REPO_ROOT = process.cwd();
const exists = (fp) => access(fp, fsC.F_OK);
const genHash = (content) => new Promise((resolve, reject) => {
 const hash = createHash('sha256');
 hash.update(content);
 resolve(hash.digest('hex').substring(0, 5));
});

export default async function(config) {
  await rimraf('dist/{css,imgs,js}/*', { glob: true });
  
  const baseConfig = {
    dir: {
      input: './src',
      output: './dist',
      // these paths are relative to the `input` directory
      data: './data',
      includes: './includes',
      layouts: './layouts',
    },
  };
  
  const pluginDeps = {
    async addDep({ page, type, val }) {
      if (
        !val
        || type !== 'svg' && typeof val !== 'string' && !Array.isArray(val)
        || type === 'svg' && typeof val !== 'object'
      ) {
        throw new Error('Invalid type provided while adding plugin dependency');
      }
      
      const assets = (!Array.isArray(val)) ? [val] : val;
      const _page = (!page)
        ? this.shared // for shared items that won't have a specific page
        : page;
      
      if (!_page.pluginDeps) _page.pluginDeps = {};
      
      if (page && this.shared.pluginDeps) {
        Object.keys(this.shared.pluginDeps).forEach((type) => {
          if (!_page.pluginDeps[type]) {
            _page.pluginDeps[type] = [...this.shared.pluginDeps[type]];
          }
        });
      }
      
      for (const asset of assets) {
        if (!_page.pluginDeps[type]) _page.pluginDeps[type] = [];
        
        if (type === 'svg') {
          if (_page.pluginDeps[type].find(({ id }) => id === asset.id)) continue;
          _page.pluginDeps[type].push(asset);
        }
        else {
          const url = `${type}/${asset}`
          if (_page.pluginDeps[type].includes(url)) continue;
          
          const fp = `${REPO_ROOT}/src/assets/${type}/${asset}`;
          try { await exists(fp); }
          catch (err) {
            throw new Error(`The ${type.toUpperCase()} file you're trying to add as a plugin dependency doesn't exist: "${fp}"`);
          }
          
          _page.pluginDeps[type].push(url);
        }
      }
    },
    
    async addCSS(val, page) {
      return await this.addDep({ page, type: 'css', val });
    },
    
    async addJS(val, page) {
      return await this.addDep({ page, type: 'js', val });
    },
    
    async addSVG(val, page) {
      return await this.addDep({ page, type: 'svg', val });
    },
    
    shared: {},
  };
  config.pluginDeps = pluginDeps;
  config.addGlobalData('pluginDeps', pluginDeps);
  
  config.pathPrefix = '/';
  config.addPlugin(EleventyHtmlBasePlugin, {
		baseHref: process.env.PATH_PREFIX || config.pathPrefix,
	});
  config.addPlugin(CleanPlugin);
  config.addPlugin(IdAttributePlugin, {
    selector: '[id],h2,h3,h4,h5,h6',
  });
  config.addPlugin(InclusiveLangPlugin);
  config.addPlugin(NavigationPlugin);
  config.addPlugin(SyntaxHighlight, {
    preAttributes: {
      'data-language': ({ language, content, options }) => language,
    },
  });
  await pluginDeps.addCSS('prism-tomorrow.css'); // for the `SyntaxHighlight` plugin
  config.addPlugin(ToCPlugin, {
    backToTopLabel: 'Top',
    insertBackToTopAfter: 'header',
    scrollSelector: '.wrapper',
  });
  config.addPlugin(HeadingLinkPlugin);
  config.addPlugin(ImgPopupPlugin);
  config.addPlugin(DrawerPlugin);
  
  const mdI = markdownIt({
    breaks: false,
    html: true,
		linkify: true,
  });
  mdI.use(markdownItDecorate);
  mdI.use(markdownItContainer, {
    name: '_',
    openRender: (tokens, index, _options) => {
      const attrs = tokens[index].info.trim().slice(1).trim().split(' ').reduce((obj, i) => {
        if (i.startsWith('.')) {
          if (!obj?.class) obj.class = [];
          obj.class.push(...i.split('.'));
        }
        if (i.startsWith('#')) {
          if (!obj?.id) obj.id = [];
          obj.id.push(i.replace(/^\#/, ''));
        }
        
        return obj;
      }, {});
      
      return `<div ${(attrs.class) ? `class="${attrs.class.join(' ')}"` : ''} ${(attrs.id) ? `id="${attrs.id.join(' ')}"` : ''}>`;
    }
  });
  mdI.linkify.set({
    fuzzyEmail: false,
    fuzzyIP: false,
    fuzzyLink: false,
  });
  config.setLibrary('md', mdI);
  
  config.setServerOptions({
		port: 3000,
  });
  
  config.setUseGitIgnore(false); // so that manifest is detected
  
  const manifest = {};
  const assetsGlob = './src/assets/**/*.{css,jpg,js,png}';
  const assetsRegEx = /src\/assets\/.*\.(css|jpg|js|png)/;
  let changedFiles;
  config.setEventEmitterMode('sequential');
  config.on('eleventy.before', async () => {
    let files;
    
    if (changedFiles) {
      files = changedFiles.filter((f) => assetsRegEx.test(f));
      changedFiles = undefined;
      if (files.length) console.log('[UPDATED]', files);
    }
    else {
      files = await glob(assetsGlob);
      console.log('[BUILD]', files);
    }
    
    async function createFile({ content, dir, ext, file, suffix = '' }) {
      const parDir = `${baseConfig.dir.output}/${dir}`;
      const _ext = extname(file);
      const fName = `${basename(file, _ext)}${suffix}`;
      const fHash = await genHash(content);
      const newExt = ext || _ext;
      const newName = `${fName}-${fHash}${newExt}`;
      
      await mkdirp(parDir);
      await writeFile(`${parDir}/${newName}`, content);
      manifest[`${dir}/${fName}${newExt}`] = `/${dir}/${newName}`;
    }
    
    const pendingFiles = [];
    for (const file of files) {
      const ext = extname(file);
      
      // NOTE: I don't like the nested Promises with async functions, but
      // without them, the build's much slower. I tried multiple configurations
      // but this was the fastest.
      switch (ext) {
        case '.css': {
          pendingFiles.push(
            new Promise(async (resolve) => {
              let s = new CleanCSS().minify([file]).styles;
              
              // Since this is outside of the `EleventyHtmlBasePlugin` pipeline
              // I have to parse all the absolute URLs so they work with GH pages.
              if (process.env.PATH_PREFIX) {
                s = s.replaceAll(/url\(([^)]+)\)/g, (a, b) => {
                  let url = b;
                  // I hate this.
                  if (b.startsWith("'/")) url = b.replace("'/", `'${process.env.PATH_PREFIX}`);
                  else if (b.startsWith('"/')) url = b.replace('"/', `"${process.env.PATH_PREFIX}`);
                  else if (b.startsWith('/')) url = b.replace('/', `${process.env.PATH_PREFIX}`);
                  return a.replace(b, url);
                });
              }
              
              await createFile({ content: s, dir: 'css', file });
              resolve();
            })
          );
          break;
        }
        case '.jpg':
        case '.png': {
          let dir = 'imgs';
          
          if (
            file.includes('/build/')
            || file.includes('/diagram/')
          ) {
            dir += file.includes('/build/') ? '/build' : '/diagram';
            
            pendingFiles.push(
              new Promise(async (resolve) => {
                await createFile({
                  content: await sharp(file).jpeg({ quality: 90 }).toBuffer(),
                  dir, ext: '.jpg', file,
                });
                resolve();
              })
            );
            pendingFiles.push(
              new Promise(async (resolve) => {
                await createFile({
                  content: await sharp(file).resize(250, 250, { fit: 'inside' }).jpeg({ quality: 90 }).toBuffer(),
                  dir, ext: '.jpg', file, suffix: '-thumb',
                });
                resolve();
              })
            );
          }
          else if (file.includes('/parts/')) {
            const sizeOpts = { background: '#ffffff', fit: 'contain' };
            dir += '/parts';
            
            pendingFiles.push(
              new Promise(async (resolve) => {
                await createFile({
                  content: await sharp(file).resize(450, 450, sizeOpts).jpeg({ quality: 90 }).toBuffer(),
                  dir, ext: '.jpg', file,
                });
                resolve();
              })
            );
            pendingFiles.push(
              new Promise(async (resolve) => {
                await createFile({
                  content: await sharp(file).resize(75, 75, sizeOpts).jpeg({ quality: 90 }).toBuffer(),
                  dir, ext: '.jpg', file, suffix: '-thumb',
                });
                resolve();
              })
            );
          }
          
          break;
        }
        case '.js': {
          pendingFiles.push(
            new Promise(async (resolve) => {
              await createFile({
                content: (await esbuild.transform(await readFile(file), { minify: true })).code,
                dir: 'js', file,
              });
              resolve();
            })
          );
          break;
        }
      }
    }
    
    if (pendingFiles.length) {
      await Promise.all(pendingFiles);
      await writeFile('./src/data/manifest.json', JSON.stringify(manifest));
    }
  });
  config.on('eleventy.beforeWatch', (_changedFiles) => { changedFiles = _changedFiles; });
  
  config.addTransform('htmlMin', function (content) {
    if ((this.page.outputPath || '').endsWith('.html')) {
      return htmlMin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      });
    }
    
    // If not an HTML output, return content as-is
    return content;
  });
  
  config.addPassthroughCopy({
    './src/assets/fonts/*': 'css/fonts',
    './src/assets/imgs/static/*': 'imgs',
    './work-files/solar-generator-wiring-diagram.drawio': 'imgs/diagram',
  });
  config.addWatchTarget(assetsGlob);
  
	return baseConfig;
};
