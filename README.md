# Solar Generator

- [View the Docs](#view-the-docs)
- [Development](#development)

---

## View the Docs

[Open the Compiled GH Pages](https://the0newhoknocks.github.io/docs.diy-solar-generator/)

[![GH Pages Build](https://github.com/the0neWhoKnocks/docs.diy-solar-generator/actions/workflows/gh-pages.yml/badge.svg?branch=main)](https://github.com/the0neWhoKnocks/docs.diy-solar-generator/actions/workflows/gh-pages.yml)

---

## Development

**NOTE** - Aliases to speed up workflow:
| Alias | Command          |
| ----- | ---------------- |
| `d`   | `docker`         |
| `dc`  | `docker compose` |
| `nr`  | `npm run`        |

**NOTE** - To ensure local development reflects what will end up in production, local files are exposed to a development Docker container. You can add `source <REPO_PATH>/bin/repo-funcs.sh` to your shell's rc file to use easier to remember commands.
To automate that process I `source` [this script](https://github.com/the0neWhoKnocks/shell-scripts/blob/master/override-cd.sh) instead, so anytime I `cd` in or out of a repo, the functions are added or removed when not at the root of the repo.

| Alias | Command |
| ----- | ------- |
| `startcont` |	Starts and enters the Container in development mode. |
| `entercont` | Enter the running development Container to debug or what ever. |

Install dependencies:
```sh
# This should be run from within the Docker container to ensure Dev dependencies are installed.
npm i
```

Generate static pages:
```sh
nr build
```

Run a local server that watches changes and allows you to preview content in your Browser:
```sh
nr start:dev
```

Resize hi-res images to their largest web-ready sizes:
```sh
# Dump your hi-res images in these folders:
# - ./.ignore/imgs/build/
# - ./.ignore/imgs/diagram/

nr resize:build
nr resize:diagram
```
