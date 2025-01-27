import inclusiveLangPlugin from '@11ty/eleventy-plugin-inclusive-language';
import clean from 'eleventy-plugin-clean';
import markdownIt from 'markdown-it';

export default async function(config) {
  config.addPlugin(clean);
  config.addPlugin(inclusiveLangPlugin);
  
  config.setLibrary('md', markdownIt({
    breaks: true,
    html: true,
		linkify: true,
  }));
  
  config.setServerOptions({
		port: 3000,
  });
  
	return {
    dir: {
      input: './src',
      output: './dist',
      // these paths are relative to the `input` directory
      data: './data',
      includes: './includes',
      layouts: './layouts',
    },
  };
};
