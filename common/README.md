# Transmute - Common

Provides common types & utilities used throughout the Transmute stack.

Please check out the [Transmute repository](https://gitlab.zakscode.com/zakscode/transmute/transmute) for more info.

## Table of Contents

<!-- TOC -->
* [Transmute - Common](#transmute---common)
  * [Table of Contents](#table-of-contents)
  * [Prerequisites](#prerequisites)
  * [Setup](#setup)
  * [Cheatsheet](#cheatsheet)
<!-- TOC -->

## Prerequisites
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [NodeJS 18](https://nodejs.org/en/)

## Setup
<details>
<summary>NPM Install</summary>

This will install the [prebuilt library](https://gitlab.zakscode.com/zakscode/transmute/transmute/-/packages) from GitLab:
1. Create a `.npmrc` file & add the GitLab's package registry URL':
```
@transmute:registry=https://gitlab.zakscode.com/api/v4/projects/85/packages/npm/
//gitlab.zakscode.com/api/v4/projects/85/packages/npm/:_authToken=tvNAnPtzjy59xFrHBJ2J
```
2. Install as normal: `npm install --save @transmute/common`

If you would like to use your local source code instead of the prebuilt library, continue to the <ins>NPM Link</ins> section.
</details>

<details>
<summary>NPM Link</summary>

Make sure you have completed the <ins>NPM Install</ins> section before continuing.

A local copy of common can be used to test changes using [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link). After cloning:
1. Install the dependencies: `npm install`
2. Build or watch the common library: `npm run build` or `npm run watch`
3. link the library to npm from common's root directory: `npm link`
4. Link the library to a project: `cd ../project && npm link @transmute/common`

**Warning:** Step 4 will need to be re-run when ever an `npm install` is completed.

This will only work on your local machine. Make sure you have completed the __NPM Install__ & `@cwb/common` is part of `package.json`.
</details>

## Cheatsheet
```bash
# Build JS
npm run build

# Watch for changes
npm run watch

# Run unit tests
npm test

# Re-run tests on changes
npm run test:watch
```
