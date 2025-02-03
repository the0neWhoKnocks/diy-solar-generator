import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { IdAttributePlugin } from '@11ty/eleventy';
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
import HeadingLinkPlugin from './src/plugins/HeadingLinkPlugin.mjs';
import ToCPlugin from './src/plugins/ToCPlugin.mjs';


const genHash = (path) => new Promise((resolve, reject) => {
 const hash = createHash('sha256');
 const rs = createReadStream(path);
 
 rs.on('error', reject);
 rs.on('data', chunk => hash.update(chunk));
 rs.on('end', () => resolve(hash.digest('hex').substring(0, 5)));
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
  config.addPlugin(ToCPlugin, {
    backToTopLabel: 'Top',
    insertBackToTopAfter: 'header',
  });
  config.addPlugin(HeadingLinkPlugin);
  
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
      const fHash = await genHash(file);
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
              await createFile({
                content: new CleanCSS().minify([file]).styles,
                dir: 'css',
                file,
              });
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
  
  config.addShortcode('imgPopUp', function(lrgURL, alt) {
    const mani = this.ctx?.environments?.manifest;
    
    if (mani) {
      const parseURL = (url) => (url.startsWith('mani:'))
        ? mani[url.replace(/^mani:/, '')]
        : url;
      const altAttr = (alt) ? ` alt="${alt}"` : '';
      const ext = '.jpg';
      
      return [
        `<a class="img-popup" href="${parseURL(`${lrgURL}${ext}`)}" target="_blank">`,
        `  <img src="${parseURL(`${lrgURL}-thumb${ext}`)}"${altAttr} />`,
        '</a>',
      ].join('');
    }
    
    return '<span>[ERROR: Missing manifest]</span>';
  });
  
  config.addPassthroughCopy({
    './src/assets/fonts/*': 'css/fonts',
    './src/assets/imgs/static/*': 'imgs',
    './work-files/solar-generator-wiring-diagram.drawio': 'imgs/diagram',
  });
  config.addWatchTarget(assetsGlob);
  
	return baseConfig;
};
