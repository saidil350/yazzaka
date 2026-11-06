---
name: no-ai-slop
description: Enforce this project's no-AI-slop UI rules when writing, restyling, or reviewing components — stock shadcn/ui, semantic tokens, zero decoration. Use whenever creating or editing any UI in this repo (public site or admin), when the user asks to deslop or audit UI, complains something looks templated/AI-generated/too decorated ("kok masih ada", "berlebihan"), or before proposing badges, cards, section headers, or other visual elements — even if they never say "slop".
---

# No AI Slop — Yazzaka UI Rules

Every rule here is a pattern the user has personally rejected in this repo, some repeatedly, and had to ask to have removed again ("kok masih ada"). This is not design taste — it is a record of user decisions. When this file and AGENTS.md disagree, AGENTS.md wins.

## Hard rules (always)

Also in AGENTS.md; repeated because they are the ones most often violated:

1. **`src/components/ui/*` is stock shadcn/ui.** Check it before writing anything custom; never fork or restyle it. Missing a component? Write the stock version, importing Radix primitives from the `radix-ui` monolith package (see `ui/label.tsx` for the pattern).
2. **No `animate-in` / `fade-in` / `slide-in-*` classes** — the tw-animate plugin is not installed, so these silently do nothing.
3. **Semantic tokens only**: `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `rounded-md`/`rounded-lg`. No hex, no `stone-*`/`slate-*`/`emerald-*`, no `rounded-2xl`/`3xl`/`rounded-[Npx]`, no hard drop shadows, no gradients.
4. **Button**: existing variants only — `default` (teal), `accent` (orange, reserved for public-website CTAs), `outline`, `secondary`, `ghost`, `destructive`, `link`. No pill/hard-shadow/pastel variants.
5. **Typography**: `text-xs`/`text-sm` with `text-muted-foreground` for secondary text. No `text-[10px]`/`text-[11px]`, no `uppercase tracking-wider` on ordinary labels.
6. **Icons are functional only**: lucide-react, `size-4`. No decorative icon tiles (icon inside a rounded colored square/circle).

## Rejected patterns — do not introduce, remove on sight

Each of these was built once in this repo and the user had it taken out:

| Pattern | Instead |
|---|---|
| Badge/eyebrow chip overlaid on an image | Caption below the image, or nothing |
| Numbered circle badges (01/02/03 missions) | One `divide-y` card; numbers as plain `text-muted-foreground tabular-nums` text |
| Icon in a rounded colored circle (Sparkles etc.) | Icon inline at `size-4` next to text, or drop it |
| Card inside a card | One flat card; use `divide-y` or spacing to separate content |
| Whole card tinted in brand color (full `teal-soft` bg) | Neutral card (white / `bg-background`); brand color only as a small accent |
| Card hover recolors border/text (teal/orange/primary) | Neutral hover (`hover:bg-muted`) or no hover restyle |
| Brand-colored focus ring on text fields | **Neutral focus, no ring** — deliberate deviation from stock; do not "fix" it back |
| Fixed-height card images (`h-40` etc.) | Aspect ratio: people `4:3`, banner `16:10` |
| Filter/tabs rows on public pages | Removed everywhere by user request; search + pagination are fine |
| Tinted section background bands | Plain `bg-background` (white) |
| Decorative uppercase micro-labels ("JIWA 0X" style) | Plain `text-xs text-muted-foreground`, sentence case |
| Credential badges in footer (SK Kemenkumham, "Binaan …") | None |
| Double frames/borders around photos | One image, no nested frame |
| Invented charts/sparklines, status dots next to switches, per-card accent colors | Omit |

**Once the user confirms a pattern is slop, sweep every occurrence in the same pass — do not fix one file and offer to do the rest.** That exact failure happened with filter tabs and had to be redone.

## Deliberate exceptions — do not purge these

A deslop pass that strips these undoes approved work. Verify against current code before touching any of them:

- Footer's warm-white `#FFFDF9` background and the dark topbar with light text.
- The header donation button's pill shape (`px-3 py-1 text-xs font-bold rounded-full accent`, no icon) — deliberate, sized like a navbar item.
- `bg-[#00A0B0]` for the active item in the mobile drawer (Header.tsx).
- Semantic status colors: WhatsApp green, status/star colors.
- Approved editorial motion: the CSS `.hero-rise`/`.hero-stagger` stagger on the homepage hero; the featured-news auto-slide (7s, pauses on hover, guards `prefers-reduced-motion`).
- The wakaf card's `bg-teal-soft` background (only its hover/border colors were removed).

## Admin pages

Admin pages are client components fed by `SchoolDataContext`/`AuthContext`. When restyling: keep handlers, ids, `aria-label`s, links, and role gating (`super_admin` vs `editor`) unchanged. New admin pages use `ConfirmDialog` (`src/components/admin/confirm-dialog.tsx`), never `window.confirm`.

## Verify

- `npx tsc --noEmit`
- `npm run build` before declaring done (route-map errors are invisible to tsc)
- Browser-verify flows per `docs/AKUN-TESTING.md`

## Quick sweep

Run when auditing (component/app files only — `globals.css` legitimately defines the raw values behind tokens):

```bash
grep -rnE "animate-in|fade-in|slide-in-|text-\[1[01]px\]|rounded-2xl|rounded-3xl|rounded-\[|tracking-wider|shadow-(md|lg|xl|2xl)|bg-gradient|bg-linear" src/components src/app --include="*.tsx"
grep -rnE "#[0-9a-fA-F]{3,8}|stone-[0-9]|slate-[0-9]|emerald-[0-9]" src/components src/app --include="*.tsx"
```

Every hit is either an approved exception (list above) or slop. Report what you found and what you changed.
