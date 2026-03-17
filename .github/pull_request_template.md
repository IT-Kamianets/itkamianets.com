## Description

Brief description of the changes and the motivation behind them.
Link to the related issue: closes #...

## Type of change

- [ ] Bug fix (`fix:`)
- [ ] New feature (`feat:`)
- [ ] Refactor (`refactor:`)
- [ ] Style / UI (`style:`)
- [ ] Documentation (`docs:`)
- [ ] Chore / config (`chore:`)

## Affected domain(s)

- [ ] People
- [ ] Team
- [ ] Events
- [ ] Competitions
- [ ] Jobs
- [ ] Businesses
- [ ] Schools
- [ ] Projects
- [ ] Services
- [ ] Shop / Merch
- [ ] Feed
- [ ] Layout / Navigation
- [ ] Translations / i18n
- [ ] SSR / Prerender
- [ ] Other

## Checklist

- [ ] Commit messages follow Conventional Commits (`type(scope): subject`)
- [ ] Component change detection is `OnPush`
- [ ] Template-driven UI state uses Angular signals
- [ ] New components are SSR-safe (no browser-only APIs at module load time)
- [ ] Styling uses shared theme variables from `src/styles/_theme.scss` where applicable
- [ ] Tailwind utilities are used for layout, spacing, and typography where appropriate
- [ ] Translations are updated in `src/app/app.translates.ts` if new text was added
- [ ] Native language characters are preserved as proper UTF-8 (no mojibake)
- [ ] Dark mode still works after the change
- [ ] `npm run build` passes without errors

## Screenshots (if applicable)

Before | After
--- | ---
(screenshot) | (screenshot)
