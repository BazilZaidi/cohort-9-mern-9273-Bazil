# SonarQube Code Quality Analysis

This folder contains screenshots from the SonarQube Cloud analysis of the Notes App project, run via SonarScanner CLI.

**Project:** cohort-9-mern-9273-Bazil
**Organization:** bazilzaidi
**Dashboard:** https://sonarcloud.io/dashboard?id=BazilZaidi_cohort-9-mern-9273-Bazil

## Summary of Results

Security Rating | B |
Maintainability Rating | A |
Security Review Rating | A |
Security Issues | 2 |
Metric | Result |
Maintainability Issues | 6 |
Security Hotspots | 0 |
Duplications | 0.68% |
New Issues (latest scan) | 10 |
Accepted (unresolved) Issues | 0 |
Lines of Code | 1.9k |

## Quality Gate

The Quality Gate currently flags 1 failed condition: Coverage (0.0% / target is 80%).

Just to clarify—this isn't because the app has no tests. It’s because I ran out of time to pipe coverage reports directly into SonarCloud (lcov exports from Mocha/Jest).

The app actually has 32 passing tests that run before commits:

17 Backend tests (Mocha/Chai): Covers auth, CRUD operations, pin/unpin, and trash/restore features.

15 Frontend tests (Jest): Covers Login, Signup, Dashboard, and Note Editor components.

They just aren't wired up to output report files into the scanner pipeline right now.

## Issues Addressed

Real, actionable issues surfaced by SonarQube during development were fixed as they came up, including:
- NoSQL injection guard on email input (signup/login)
- CORS restricted to the actual frontend origin
- Disabled X-Powered-By header (framework disclosure)
- Simplified email regex to avoid ReDoS backtracking risk
- Accessibility fixes (button types, keyboard navigation, ARIA labels)
- Optional chaining and code-smell cleanups

I skipped generic TypeScript conversion warnings since this project was intentionally built with standard JavaScript per the initial setup.

## Screenshots

1. `Security.PNG` Security rating and issue breakdown
2. `Maintainability.PNG` Maintainability rating and issue trend
3. `QualityGate.PNG` Quality gate status, open issues, duplications, coverage
4. `Security-hotspot.PNG` Security hotspots review status
5. `Summary.PNG` Project summary with new/accepted issues and the failed coverage condition
6. `Reliability.PNG` Reliablity rating and issue breakdown 