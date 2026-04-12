# Changelog

All notable changes to this project will be documented in this file.

## [0.1.1.1] - 2026-04-12

### Changed
- Upgraded Next.js from 16.1.6 to 16.2.3 and matched eslint-config-next version
- Updated `tsconfig.json` `moduleResolution` to `bundler` (required by Next.js 16.2.3)
- Added `.github/dependabot.yml` with npm groups (react, next, auth, testing, types) and github-actions ecosystem monitoring

## [0.1.1.0] - 2026-04-09

### Added
- Personal Projects section on /projects featuring minisiwyg-editor, a ~4KB gzipped WYSIWYG editor with built-in XSS sanitizer
- Optional demo and repo links on project cards for open source work

### Changed
- CLAUDE.md is now local-only (untracked, gitignored) since it is agent-instruction scratch space

## [0.1.0.0] - 2026-03-31

### Added
- Backgammon game engine with full rule support: bar entry, bearing off, blot hitting, doubles (4 moves), must-use-maximum-dice, and must-use-larger-die rules
- Heuristic AI opponent that evaluates positions by pip count, primes, blots, anchors, home board presence, and blocking
- 56 tests covering engine logic and AI behavior
