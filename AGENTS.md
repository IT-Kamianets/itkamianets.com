# AGENTS.md

This file defines repo-specific instructions for coding agents working in this project.

## Project Overview

- Stack: Angular 21, TypeScript 5, Angular SSR/prerender, Tailwind CSS v4, PrimeNG 21, PrimeUIX themes, SCSS, Express SSR server.
- Package manager: `npm`
- Formatting: Prettier with tabs, single quotes, and 100 character line width.
- Primary output: prerendered static site from `dist/app/browser`

## Core Expectations

- Preserve the existing Angular architecture and keep changes aligned with Angular 21 patterns.
- Prefer standalone Angular components and lazy-loaded pages.
- Keep change detection `OnPush` for generated or new components.
- Treat signals as the default state mechanism for template-driven UI state.
- For new forms, prefer Angular Signal Forms unless the surrounding code already uses another pattern.
- Assume the app is optimized for static landing pages first, not for a heavy client-side application shell.

## Routing And SSR

- App routes live in `src/app/app.routes.ts`.
- Server prerender configuration lives in `src/app/app.routes.server.ts` and `src/app/app.config.server.ts`.
- Do not introduce changes that break prerendering or require a browser-only runtime during build unless clearly isolated.
- When adding a page, make it compatible with prerendering by default.

## Wacom Usage

- This project uses `wacom`, an Angular utility library for shared services, directives, pipes, and app-level configuration.
- `wacom` is installed and configured in `src/app/app.config.ts` via `provideWacom(wacomConfig)` and `provideTranslate()`.
- Prefer bootstrapping with `provideWacom({...})` in application providers. Use `WacomModule` / `WacomModule.forRoot()` only for legacy NgModule-based apps.
- Repo-level `wacom` config lives in `src/app/wacom.config.ts`. Extend that file when adding shared `wacom` configuration instead of scattering setup across features.
- Put library-wide configuration in `provideWacom()` instead of scattering it across components. Available config areas include `http`, `store`, `meta`, `network`, and optional `socket` / `io`.
- Use `wacom` services directly through Angular DI. Do not wrap `HttpService`, `CrudService`, `ThemeService`, `TranslateService`, or other SSR-safe `wacom` services in `isPlatformBrowser` guards or lazy `Injector.get(...)` access just for SSR.
- Keep SSR guards focused on actual browser APIs such as `localStorage`, `window`, `document`, `navigator`, WebRTC, or other DOM-only behavior.
- Prefer the library services before adding duplicate app utilities:
  `HttpService` for API calls and shared headers/base URL handling,
  `StoreService` for persisted local storage values,
  `MetaService` for title, description, robots, image, and link tags,
  `CrudService` for data flows that need offline-aware syncing behavior,
  `ThemeService` for mode switching,
  `TranslateService` and app translations for localized UI,
  `EmitterService`, `NetworkService`, `SocketService`, `RtcService`, `TimeService`, and `UtilService` when their built-in behavior matches the need.
- Prefer importing the specific `wacom` directives, pipes, and translation helpers you need instead of wrapping the whole library again in another shared abstraction.
- For metadata, prefer configuring defaults in `provideWacom({ meta: ... })` and using `MetaService` or route metadata. If route-driven updates are expected, prefer `meta.applyFromRoutes = true`; use `MetaGuard` only when that flow specifically needs a guard.
- For translations, register app translations with `provideTranslate(...)` and use the exported translation pipe/directive rather than creating another parallel translation bootstrap path.
- Common reusable building blocks exported by the library include `clickOutside`, manual form-related directives, translation helpers, and array/search/safe/pagination-style pipes.
- When changing app behavior, prefer configuring or composing `wacom` services first before modifying the library source.
- If a feature needs browser-only `wacom` behavior such as realtime, RTC, or DOM interaction, isolate the browser-specific calls without blocking server rendering of the rest of the feature.

## File Placement

- App-level pages: `src/app/pages/<page-name>/`
- Layout components: `src/app/layouts/`
- Shared generic UI/components/services/pipes/directives/interfaces: `src/app/<type>/`
- Feature-specific business logic: `src/app/feature/<feature-name>/`
- Feature-owned startup or preload logic should live under `src/app/feature/<feature-name>/` and be registered from app config, not implemented directly in `main.ts`
- Translation entries: `src/app/app.translates.ts`
- Language feature metadata: `src/app/feature/language/language.type.ts`, `language.interface.ts`, `language.const.ts`
- Global theme tokens: `src/styles/_theme.scss`
- Global styles entry: `src/styles.scss`

## Styling Rules

- Prefer Tailwind utilities for layout, spacing, typography, colors, borders, sizing, and responsive behavior.
- PrimeNG is installed; use PrimeNG components where they improve consistency or speed of delivery.
- PrimeNG global config lives in `src/app/app.config.ts` via `providePrimeNG` and currently uses `@primeuix/themes/aura`.
- Keep PrimeNG theme usage compatible with app mode switching (`data-mode` / dark mode selector) and existing theme tokens.
- Use component SCSS for styles that are not ergonomic in Tailwind or need local structure.
- Reuse theme variables from `src/styles/_theme.scss` before introducing new raw values.
- Keep selectors shallow and component-local.
- Avoid `::ng-deep` and `ViewEncapsulation.None` unless integration constraints require them.
- Use Material Symbols Outlined as the default icon set.

## Templates And Accessibility

- Keep templates simple and declarative.
- Prefer Angular bindings over manual DOM manipulation.
- Decorative icons should use `aria-hidden="true"`.
- Interactive controls must have an accessible text label or `aria-label`.

## Translations And Encoding

- Keep language codes in sync with `src/app/feature/language/language.type.ts`.
- Keep language labels in `src/app/feature/language/language.const.ts`.
- Keep UI translation strings in `src/app/app.translates.ts`.
- Preserve native language characters as UTF-8 text; do not introduce mojibake such as `FranÃ§ais`.
- When adding a language, update both the language metadata files and the translation map.

## Code Change Guidance

- Make the smallest coherent change that solves the task.
- Preserve existing naming, structure, and visual language unless the task explicitly asks for redesign.
- Prefix private class members with `_`, including variables, injected fields, and methods
- Omit explicit function and method return types; rely on TypeScript inference unless a specific edge case forces an explicit annotation
- Order class members consistently: injected fields, public state, private state, constructor, public methods, private methods
- Avoid introducing new dependencies unless necessary.
- If adding browser APIs, guard them for SSR compatibility.
- Guard actual browser-only APIs such as `localStorage`, not SSR-safe Angular or `wacom` services.
- Keep comments sparse and only where logic is not obvious.

## Verification

After meaningful changes, verify with the most relevant command available.

- `npm run build`
- `npm start` for local development checks when needed

## Notes For Future Agents

- This repository currently contains a landing page under `src/app/pages/landing/` and a topbar layout under `src/app/layouts/topbar/`.
- The Angular workspace defaults skip test generation for most schematics, so absence of tests is normal unless a task explicitly adds them.
