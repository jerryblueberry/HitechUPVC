# FaqList
Status: review
Owner: agent
Last reviewed: 2026-09-27

## Purpose
Accessible FAQ accordion using native `<details>` / `<summary>` — no client JS.

## Design Decisions
- Hairline dividers, gold “+” that rotates on open
- Answers stay in the DOM for SEO

## Props / Data
- `faqs: FAQ[]` from `getFAQs()`

## Implementation Notes
- File: `components/ui/FaqList.tsx`
- Pair with `FaqJsonLd` on the page

## Review Checklist
- [x] Keyboard operable without extra JS
- [x] One heading per question is the summary text
