import cp from 'node:child_process';
import { stat } from 'node:fs/promises';
import { promisify } from 'node:util';

const exec = promisify(cp.exec);
const formatDate = (date) => {
  return (new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    timeZone: "America/Los_Angeles",
    year: 'numeric',
  }))
    .formatToParts(date)
    .reduce((str, { type, value }) => str.replace(type, value), 'year-month-day');
}
const getDate = async (fP, type) => {
  const gitCmd = (type === 'created')
    ? 'git log --diff-filter=A --follow -1 --format=%at'
    : 'git log -1 --format=%at';
  let rawGitTime = (await exec(`${gitCmd} "${fP}"`)).stdout || 0;
  if (rawGitTime) rawGitTime = new Date(parseInt(rawGitTime) * 1000);
  
  const fileStat = await stat(fP);
  const rawFileTime = new Date((type === 'created') ? fileStat.birthtime : fileStat.mtime);
  
  // git timestamp will be more accurate in CI, local timestamp will more accurate during development
  return (
    rawGitTime
    && (process.env.CI || rawGitTime.getTime() > rawFileTime.getTime())
  )
    ? formatDate(rawGitTime)
    : formatDate(rawFileTime);
}

export default {
  page: {
    ogURL: (process.env.OG_URL) ? process.env.OG_URL : undefined,
    pubDate: async ({ page }) => {
      const created = await getDate(page.inputPath, 'created');
      const modified = await getDate(page.inputPath, 'modified');
      
      return (modified != created) ? modified : created;
    },
  },
};
