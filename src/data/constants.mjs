function timestamp() {
  return (new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    timeZone: "America/Los_Angeles",
    year: 'numeric',
  }))
    .formatToParts(new Date())
    .reduce((str, { type, value }) => str.replace(type, value), 'year/month/day');
}

export default function (config) {
  return {
    title: 'DIY Solar Generator',
    updated: timestamp(),
  };
};
