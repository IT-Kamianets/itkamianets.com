# CV Template Strategy

This folder contains pdfmake template implementations for CV generation.

## Overview

The CV generator uses the Strategy Pattern:

- `CvTemplateInterface` defines the contract for all templates.
- Each theme is an implementation of this contract (`LightCvTemplate`, `DarkCvTemplate`).
- `CvPdfService` resolves a template by key from a registry and delegates `docDefinition` creation to that template.

This keeps `CvPdfService` focused on PDF lifecycle operations (blob/data-url/download) and removes theme-specific layout logic from the service.

## Add a New Theme

1. Create `new-theme.template.ts` in this folder.
2. Extend `CvBaseTemplate` (or implement `CvTemplateInterface`) and define your palette/layout in `getDocDefinition`.
3. Register the new theme key in `CvPdfService` registry map.
4. Add the new theme option to the UI dropdown options array in CV form component.
5. Verify generation flow and run build.

## Contract

- Input model: `CvTemplateData`
- Required method: `getDocDefinition(data: CvTemplateData): Promise<Record<string, unknown>>`

## Current Themes

- `light` -> `LightCvTemplate`
- `dark` -> `DarkCvTemplate`
