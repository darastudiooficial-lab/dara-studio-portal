# CSS Safety Rules — PERMANENT
## Applies to every task involving CSS, styling, or index.css

---

## Pre-Task Checklist (run BEFORE any CSS change)

- [ ] `index.css` is imported in `client/src/main.jsx`
- [ ] All `:root {}` variables are intact in `index.css`
- [ ] No `var(--anything)` references exist without a defined value

## Post-Task Checklist (run AFTER any CSS change)

- [ ] `index.css` is still valid — no syntax errors, no corrupted characters
- [ ] All variables used in modified files are still defined in `:root`
- [ ] Dev server renders the page visibly (no white screen, no black screen)
- [ ] `git add -A && git commit -m "done: [description]"` executed

---

## Forbidden Operations

| ❌ Never do this | ✅ Do this instead |
|---|---|
| `echo 'css' >> file.css` (PowerShell redirect) | Use `write_to_file`, `replace_file_content`, or `multi_replace_file_content` tools |
| `echo ... >> DESIGN_SYSTEM.md` | Same — use the file editing tools |
| Any PowerShell `>>` append to text/css/md files | `[System.IO.File]::WriteAllLines(..., UTF8Encoding(false))` if absolutely necessary |

> **Why:** PowerShell's `echo >>` writes **UTF-16 LE** encoding, injecting null bytes (`\u0000`) between every character. This silently corrupts CSS files and causes a white screen on the next page load.

---

## CSS Variable Registry

All variables currently defined in `:root` (as of last audit):

```
--brand-purple: #7B1FA2
--brand-pink: #E91E63
--dark-bg: #050505
--font-serif: 'Playfair Display', Georgia, serif
--font-sans: 'Inter Tight', 'Inter', 'Plus Jakarta Sans', sans-serif
--color-offwhite: #F8F9FA
--color-neon-purple: var(--brand-purple)
--color-neon-magenta: var(--brand-pink)
--bg-primary: var(--dark-bg)
--text-color: #ffffff
--glass-bg: rgba(24, 24, 27, 0.6)
--glass-border: rgba(255, 255, 255, 0.1)
--neon-glow: rgba(123, 31, 162, 0.4)
--nav-link-color: rgba(255, 255, 255, 0.6)
--bg-glow-opacity: 0.15
--footer-bg: #020203
--footer-text: rgba(255, 255, 255, 0.4)
--interactive-height: 48px
--btn-height: var(--interactive-height)
```

---

## Component Class Registry

Reusable classes that must never be duplicated or recreated from scratch:

| Class | Purpose |
|---|---|
| `.btn-glow` | Primary CTA button with gradient + glow |
| `.glass-pill` | Secondary ghost/glass button |
| `.glass-input` | Inputs and selects |
| `.service-card-premium` | Bento box workflow/service card |
| `.service-list` / `.service-list-item` | Checklist items inside cards |
| `.service-box-green` / `.service-box-green-title` | Included services box (green border) |
| `.service-box-red` / `.service-box-red-title` | Excluded services box (red border) |
| `.service-disclaimer` | Yellow-left-border callout / "Why this matters" |
| `.service-output-badge` | Timeline/output label badge |
| `.page-header-premium` | Standard page header wrapper |
| `.title-gradient-italic` | Gradient italic heading span |
| `.title-white` | White heading span |
| `.timeline-badge` | Small pill badge for timelines |
