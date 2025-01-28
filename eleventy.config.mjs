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
import markdownIt from 'markdown-it';
import markdownItDecorate from 'markdown-it-decorate';
import { mkdirp } from 'mkdirp';


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
  
  const manifest = {};
  config.addGlobalData('page.manifest', () => manifest);
  
  let changedFiles;
  config.setEventEmitterMode('sequential');
  config.on('eleventy.before', async () => {
    let files;
    
    if (changedFiles) {
      files = changedFiles.filter((f) => /src\/assets\/.*\.(css|js)/.test(f));
      changedFiles = undefined;
      if (files.length) console.log('[UPDATED]', files);
    }
    else {
      files = await glob('./src/assets/*.{css,js}');
      console.log('[BUILD]', files);
    }
    
    for (const file of files) {
      const ext = extname(file);
      let content, dir;
      
      switch (ext) {
        case '.css': {
          content = new CleanCSS().minify([file]).styles;
          dir = 'css';
          break;
        }
        case '.js': {
          content = (await esbuild.transform(await readFile(file), { minify: true })).code;
          dir = 'js';
          break;
        }
      }
      
      if (content) {
        const parDir = `${baseConfig.dir.output}/${dir}`;
        const fName = basename(file, ext);
        const fHash = await genHash(file);
        const newName = `${fName}-${fHash}${ext}`;
        
        await mkdirp(parDir);
        await writeFile(`${parDir}/${newName}`, content);
        manifest[`${fName}${ext}`] = `/${dir}/${newName}`;
      }
    }
  });
  config.on('eleventy.beforeWatch', (_changedFiles) => { changedFiles = _changedFiles; });
  
  // TODO: remove?
  // config.addExtension('css', {
	// 	outputFileExtension: 'css',
	// 	compile: async function (fileContents) {
  //     console.log(fileContents);
  //     const result = new CleanCSS().minify(fileContents).styles;
  //     return (data) => result;
	// 	},
	// });
  // config.addPassthroughCopy({
  //   './src/assets/*.css': 'css',
  //   './src/assets/*.js': 'js',
  // });
  config.addWatchTarget('./src/assets/*.{css,js}');
  
	return baseConfig;
};
