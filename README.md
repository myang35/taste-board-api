# TasteBoard API

## Installation

Run the following to clone the repository, install dependencies, and setup git hooks:

```bash
git clone https://github.com/myang35/taste-board-api.git
cd taste-board-api
yarn
git config core.hooksPath .git-hooks
```

### Setup Environment

1. Create a `.env` file in the project's root directory.

2. The `.env` file should have the following variables set:

```
JWT_SECRET=[JWT Secret Key]
MONGODB_URI=[MongoDB URI/Connection String]
```

## Development notes

### Git Commit Messages

Reference: https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13

Use the imperative, present tense: "change", not "changed" nor "changes".

#### Format

```
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

#### Types

- `feat` Add or remove a feature
- `fix` Fix a bug
- `refactor` Rewrite/restructure code, but does not change any behavior
- `perf` Improve performance (subtype of `refactor`)
- `style` White-space, formatting, missing semi-colons, etc
- `test` Add or update existing tests
- `docs` Add or update documentation
- `build` Change to build components like build tool, ci pipeline, dependencies, project version, etc
- `ops` Change to operational components like infrastructure, deployment, backup, recovery, etc
- `chore` Miscellaneous e.g. modifying `.gitignore`

#### Examples

- ```
  feat: add email notifications on new direct messages
  ```
- ```
  feat(shopping cart): add the amazing button
  ```
- ```
  feat!: remove ticket list endpoint

  refers to JIRA-1337

  BREAKING CHANGES: ticket endpoints no longer support list all entities.
  ```

- ```
  fix(shopping-cart): prevent order an empty shopping cart
  ```
- ```
  fix(api): fix wrong calculation of request body checksum
  ```
- ```
  fix: add missing parameter to service call

  The error occurred because of <reasons>.
  ```

- ```
  perf: decrease memory footprint for determine unique visitors by using HyperLogLog
  ```
- ```
  build: update dependencies
  ```
- ```
  build(release): bump version to 1.0.0
  ```
- ```
  refactor: implement fibonacci number calculation as recursion
  ```
- ```
  style: remove empty line
  ```

---
