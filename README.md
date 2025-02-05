# Solar Generator

- [View the Docs](#view-the-docs)
- [Development](#development)

---

## View the Docs

[Open the Compiled GH Pages](https://the0newhoknocks.github.io/docs.diy-solar-generator/)

[![GH Pages Build](https://github.com/the0neWhoKnocks/web-components/actions/workflows/gh-pages.yml/badge.svg?branch=main)](https://github.com/the0neWhoKnocks/web-components/actions/workflows/gh-pages.yml)

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

Install dependencies
```sh
# This should be run from within the Docker container to ensure Dev dependencies are installed.
npm i
```

Run the App
```sh
# Prod mode
nr start

# Dev mode
nr start:dev
```

---

## Docker

```sh
# Compile Production code (required since the assets are copied over)
nr build
# Build and start the container
dc up --build solar-generator

# Or just start the container if you have 'dist' mapped or you just want to use the old build
dc up solar-generator
```
