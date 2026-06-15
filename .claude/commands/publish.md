---
description: Publish packages/skillsTUI to npm with a safe console release
---

Prepare and run a release of `packages/skillsTUI` from the console.

Requested bump: `$1`

We publish from the console (local `npm` login) on purpose: npm automation
tokens are short-lived, so the GitHub Action publish is unreliable. This command
does the whole release locally.

Rules:

- The bump must be `patch`, `minor`, or `major`.
- If `$1` is empty or invalid, ask which one to use before continuing.
- Before doing anything, explain what the release will do: validate the npm
  registry login, run tests + typecheck + build, bump the version, create a
  commit and a `skillstui@<version>` tag, publish to npm from the console, push
  the commit and tag to GitHub, and create a GitHub Release.
- Confirm you are on `main` and the working tree is clean:
  - `git branch --show-current`
  - `git status --short`
- If you are not on `main`, stop and explain that releases must come from `main`.
- If there are uncommitted changes, stop and list the pending files (the release
  creates its own version-bump commit, so the tree must be clean first).
- Confirm you are logged in to npm and own the package:
  - `npm whoami`
  - if not logged in, stop and tell the user to run `npm login`
- Ask for explicit confirmation before executing anything.
- Only after confirmation, run these steps in order (stop on any failure):

  1. Validate the package builds and passes:
     - `bun install`
     - `bun test`
     - `bun run typecheck`
     - `bun run build`
     (run inside `packages/skillsTUI`)
  2. Bump the version without creating npm's own tag:
     - `cd packages/skillsTUI && npm version $1 --no-git-tag-version`
     - capture the new `X.Y.Z` from the output
     - `bun install` to refresh `bun.lock`
  3. Commit the bump from the repo root:
     - `git add packages/skillsTUI/package.json packages/skillsTUI/bun.lock`
     - `git commit -m "chore: release skillstui v<X.Y.Z>"`
  4. Tag the release (name MUST match the package.json version):
     - `git tag skillstui@<X.Y.Z>`
  5. Publish from the console (uses your local npm login):
     - `cd packages/skillsTUI && npm publish --access public`
  6. Push commit and tag:
     - `git push origin main`
     - `git push origin skillstui@<X.Y.Z>`
  7. Create the GitHub Release:
     - `gh release create skillstui@<X.Y.Z> --title "skillstui v<X.Y.Z>" --generate-notes`

- If `npm publish` fails, do NOT push the tag. Report the error and leave the
  local commit/tag in place so the publish can be retried (or undone with
  `git tag -d skillstui@<X.Y.Z>` and `git reset --soft HEAD~1`).

Notes:

- The tag version and the `version` field in `packages/skillsTUI/package.json`
  must be identical.
- Pushing a `skillstui@*` tag also triggers `.github/workflows/publish-cli.yml`,
  which will try to publish the same version and fail as a duplicate. Since we
  publish from the console now, that Action is redundant — recommend disabling or
  deleting it to avoid the confusing failed run.

When finished, summarize the published version, the tag created, the npm publish
result, the GitHub Release URL, and any important warnings from the process.
