export default (id, cl) => `<svg class="plugin-icon${(cl) ? ` ${cl}` : ''}"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${id}"></use></svg>`;
