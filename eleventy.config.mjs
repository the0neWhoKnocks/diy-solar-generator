import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { IdAttributePlugin } from '@11ty/eleventy';
import NavigationPlugin from '@11ty/eleventy-navigation';
import InclusiveLangPlugin from '@11ty/eleventy-plugin-inclusive-language';
import CleanCSS from 'clean-css';
import CleanPlugin from 'eleventy-plugin-clean';
import * as esbuild from 'esbuild';
import { glob } from 'glob';
import htmlMin from 'html-minifier-terser';
import markdownIt from 'markdown-it';
import markdownItDecorate from 'markdown-it-decorate';
import { mkdirp } from 'mkdirp';
import sharp from 'sharp';


const genHash = (path) => new Promise((resolve, reject) => {
 const hash = createHash('sha256');
 const rs = createReadStream(path);
 
 rs.on('error', reject);
 rs.on('data', chunk => hash.update(chunk));
 rs.on('end', () => resolve(hash.digest('hex').substring(0, 5)));
});

export default async function(config) {
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
  config.addPlugin(IdAttributePlugin);
  config.addPlugin(InclusiveLangPlugin);
  config.addPlugin(NavigationPlugin);
  
  const mdI = markdownIt({
    breaks: true,
    html: true,
		linkify: true,
  });
  mdI.use(markdownItDecorate);
  config.setLibrary('md', mdI);
  
  config.setServerOptions({
		port: 3000,
  });
  
  config.setUseGitIgnore(false); // so that manifest is detected
  
  const manifest = {};
  const assetsGlob = './src/assets/**/*.{css,jpg,js}';
  const assetsRegEx = /src\/assets\/.*\.(css|jpg|js)/;
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
      const fName = `${basename(file, ext)}${suffix}`;
      const fHash = await genHash(file);
      const newName = `${fName}-${fHash}${ext}`;
      
      await mkdirp(parDir);
      await writeFile(`${parDir}/${newName}`, content);
      manifest[`${dir}/${fName}${ext}`] = `/${dir}/${newName}`;
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
                ext,
                file,
              });
              resolve();
            })
          );
          break;
        }
        case '.jpg': {
          if (file.includes('/parts/')) {
            const sizeOpts = { background: '#ffffff', fit: 'contain' };
            const dir = 'imgs/parts';
            
            pendingFiles.push(
              new Promise(async (resolve) => {
                await createFile({
                  content: await sharp(file).resize(450, 450, sizeOpts).jpeg({ quality: 90 }).toBuffer(),
                  dir, ext, file,
                });
                resolve();
              })
            );
            pendingFiles.push(
              new Promise(async (resolve) => {
                await createFile({
                  content: await sharp(file).resize(75, 75, sizeOpts).jpeg({ quality: 90 }).toBuffer(),
                  dir, ext, file, suffix: '-thumb',
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
                dir: 'js', ext, file,
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
        `<a href="${parseURL(`${lrgURL}${ext}`)}" target="_blank">`,
        `  <img src="${parseURL(`${lrgURL}-thumb${ext}`)}"${altAttr} />`,
        '</a>',
      ].join('');
    }
    
    return '<span>[ERROR: Missing manifest]</span>';
  });
  
  // TODO: remove? maybe use for favicons
  // config.addPassthroughCopy({
  //   './src/assets/*.css': 'css',
  //   './src/assets/*.js': 'js',
  // });
  config.addWatchTarget(assetsGlob);
  
	return baseConfig;
};
