#!/usr/bin/env bash
# Runs the e2e suite in the Playwright image that matches @playwright/test, the same image CI uses,
# so screenshots match CI pixel for pixel. Arguments go to `playwright test`, for example:
#   pnpm e2e:docker --update-snapshots
#   pnpm e2e:docker -g "home (ja)"
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

playwright=$(node -p "require('@playwright/test/package.json').version")
pnpm_version=$(node -p "require('./package.json').packageManager.split('+')[0]")

# The container keeps its own node_modules and pnpm store in volumes, since native packages differ
# from the host's. CI=1 also keeps lefthook from rewriting the host's git hooks. Files the
# container creates in the checkout are handed back to the host user when it exits.
docker run --rm --init --ipc=host --platform linux/amd64 \
	--volume "$PWD:/work" --workdir /work \
	--volume imi-e2e-node-modules:/work/node_modules \
	--volume imi-e2e-pnpm-store:/pnpm-store \
	--env CI=1 --env HOST_IDS="$(id -u):$(id -g)" --env PNPM_VERSION="$pnpm_version" \
	"mcr.microsoft.com/playwright:v$playwright-noble" \
	bash -c '
		set -euo pipefail
		trap "find /work -path /work/node_modules -prune -o -user root -exec chown \$HOST_IDS {} +" EXIT
		git config --global --add safe.directory /work
		npm install --global --silent "$PNPM_VERSION"
		pnpm install --frozen-lockfile --store-dir /pnpm-store
		pnpm e2e "$@"
	' bash "$@"
