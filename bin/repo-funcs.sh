#!/bin/bash

CONTAINER="solar-generator-dev"
export REPO_FUNCS=()

# Wire up the current User so that any files created in development can easily
# be manipulated by the User or during test runs.
# Export to ensure `docker compose` can use'm
export CURR_UID=$(id -u)
export CURR_GID=$(id -g)

REPO_FUNCS+=("startcont")
function startcont {
  # ensure required directories are set up
  mkdir -p ./.ignore
  mkdir -p ./src/{data,includes,layouts}
  touch ./.ignore/.zsh_history
  chmod 777 ./.ignore/.zsh_history
  
  # boot container and enter it
  docker compose up --remove-orphans -d "${CONTAINER}"
  exitCode=$?
  if [ $exitCode -ne 0 ]; then
    echo "[ERROR] Problem starting ${CONTAINER}"
    return $exitCode
  fi
  docker compose exec -u node -it "${CONTAINER}" zsh && docker compose down
}

REPO_FUNCS+=("entercont")
function entercont {
  docker compose exec -u node -it "${CONTAINER}" zsh
}
